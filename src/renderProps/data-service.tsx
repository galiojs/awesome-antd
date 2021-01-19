import React from 'react';
import omit from 'lodash.omit';
import shallowequal from 'shallowequal';

export type DataUpdatedCallback = (data: any) => void;

export interface DataServiceProps<D> {
  requestOnDidMount?: boolean;
  queries?: any[];
  dataService: (...queries: any[]) => any;
  onDataUpdated?: DataUpdatedCallback;
  children: (
    provided: { data?: D; requesting?: boolean },
    transmittedProps?: any
  ) => React.ReactChild;
}

export interface DataServiceState<D> {
  requesting: boolean;
  data?: D;
}

const OWN_PROPS = ['requestOnDidMount', 'dataService', 'children'];

export class DataService<D = any> extends React.PureComponent<
  DataServiceProps<D>,
  DataServiceState<D>
> {
  static defaultProps = {
    requestOnDidMount: false,
  };

  state: DataServiceState<D> = {
    requesting: false,
  };

  /**
   * Auto-increment number for every request.
   */
  private _lastRequestId: number = 0;

  componentDidMount() {
    const { requestOnDidMount } = this.props;
    if (requestOnDidMount) {
      this._attemptToGetData();
    }
  }

  componentDidUpdate({ queries: prevQs }: DataServiceProps<D>) {
    const { queries } = this.props;
    if (Array.isArray(prevQs) && Array.isArray(queries) && !shallowequal(prevQs, queries)) {
      this._getData(queries);
    }
  }

  private _getData = async (
    qs: any[] | DataUpdatedCallback = [],
    callback?: DataUpdatedCallback
  ) => {
    const queries = typeof qs != 'function' ? qs : [];
    const cb = typeof qs == 'function' ? qs : callback;
    const { dataService } = this.props;
    if (typeof dataService !== 'function') {
      console.error('[DataService]: `dataService` expected.');
      return;
    }
    this._lastRequestId += 1;
    const requestId = this._lastRequestId;
    this.setState({ requesting: true });
    const data = await dataService(...queries);

    // There is another request that has not been fulfilled.
    // We should skip this result.
    if (requestId !== this._lastRequestId) {
      return;
    }

    this.setState({ requesting: false, data }, () => {
      if (typeof cb === 'function') {
        cb(data);
      }
      if (typeof this.props.onDataUpdated == 'function') {
        this.props.onDataUpdated(data);
      }
    });
  };

  private _shouldGetData = () => {
    return !this.state.requesting && this.state.data === undefined;
  };

  private _attemptToGetData = () => {
    if (!this._shouldGetData()) {
      return;
    }
    this._getData(this.props.queries);
  };

  getData = (forced = false, callback?: DataUpdatedCallback) => {
    if (!forced) {
      this._attemptToGetData();
      return;
    }
    this._getData(this.props.queries, callback);
  };

  getDataByQ = (qs: any[], forced = false, callback?: DataUpdatedCallback) => {
    if (!forced) {
      this._attemptToGetData();
      return;
    }
    this._getData(qs, callback);
  };

  setData = (getNewData: (data: any) => any, callback?: () => void) => {
    this.setState(({ data }) => ({ data: getNewData(data) }), callback);
  };

  render() {
    const { data, requesting } = this.state;
    const { children } = this.props;

    return children({ data, requesting }, omit(this.props, OWN_PROPS));
  }
}

export default DataService;
