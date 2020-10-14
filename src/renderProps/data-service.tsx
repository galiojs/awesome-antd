import React from 'react';
import omit from 'lodash.omit';

export interface DataServiceProps {
  requestOnDidMount?: boolean;
  dataService: (q?: any) => any;
  onDataUpdated?: (data: any) => void;
  children: (
    provided: { data: any; requesting?: boolean },
    transmittedProps?: any
  ) => React.ReactChild;
}

export interface DataServiceState {
  requesting: boolean;
  data: any;
}

const OWN_PROPS = ['requestOnDidMount', 'dataService', 'children'];

export class DataService extends React.PureComponent<DataServiceProps, DataServiceState> {
  static defaultProps: Partial<DataServiceProps> = {
    requestOnDidMount: false,
  };

  state = {
    requesting: false,
    data: undefined,
  };

  /**
   * Auto-increment number for every request.
   */
  private _lastRequestId: number = 0;

  componentDidMount() {
    const { requestOnDidMount } = this.props;
    if (requestOnDidMount) {
      this._tryToGetData();
    }
  }

  private _getData = async (q?: any, callback?: (data: any) => void) => {
    const query = typeof q != 'function' ? q : null;
    const cb = typeof q == 'function' ? q : callback;
    const { dataService } = this.props;
    if (typeof dataService !== 'function') {
      console.error('[DataService]: `dataService` expected.');
      return;
    }
    this._lastRequestId += 1;
    const requestId = this._lastRequestId;
    this.setState({ requesting: true });
    const data = await dataService(query);

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

  private _tryToGetData = () => {
    if (!this._shouldGetData()) {
      return;
    }
    this._getData();
  };

  getData = (forced = false, callback?: (data: any) => void) => {
    if (!forced) {
      this._tryToGetData();
      return;
    }
    this._getData(callback);
  };

  getDataByQ = (q: any, forced = false, callback?: (data: any) => void) => {
    if (!forced) {
      this._tryToGetData();
      return;
    }
    this._getData(q, callback);
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
