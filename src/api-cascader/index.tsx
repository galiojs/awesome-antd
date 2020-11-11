import React from 'react';
import omit from 'lodash.omit';

import { DataService } from './../renderProps/data-service';
import AweCascader, { AweCascaderProps, CascaderOptionType } from './../cascader';

export interface AwdApiCascaderProps extends Omit<AweCascaderProps, 'options' | 'loadData'> {
  /**
   * Defaults to `onFocus`
   */
  trigger: 'onDidMount' | 'onFocus';

  serviceQueries?: any[];
  dataService(...queries: any[]): Promise<CascaderOptionType[]>;
  childDataService?(
    targetOption?: CascaderOptionType,
    selectedOptions?: CascaderOptionType[]
  ): Promise<CascaderOptionType[]>;
}

export class AweApiCascader extends React.PureComponent<AwdApiCascaderProps> {
  static defaultProps: Partial<AwdApiCascaderProps> = {
    trigger: 'onFocus',
  };

  private _dataServiceRef = React.createRef<DataService>();

  private _focusHandler = (evt: React.MouseEvent<HTMLSpanElement>) => {
    const { trigger } = this.props;
    if (trigger === 'onFocus') {
      this._dataServiceRef.current?.getData();
    }

    this.props.onFocus?.(evt);
  };

  private _getLoadDataHandler = () => {
    const { childDataService } = this.props;
    if (typeof childDataService != 'function') {
      return;
    }
    return async (selectedOptions: CascaderOptionType[]) => {
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;

      const childOptions = await childDataService(targetOption, selectedOptions);
      targetOption.loading = false;
      targetOption.children = childOptions;

      this._dataServiceRef.current?.setData((data: CascaderOptionType[]) => [...data]);
    };
  };

  render() {
    const { trigger, serviceQueries, dataService } = this.props;
    const props = omit(this.props, [
      'trigger',
      'serviceQueries',
      'dataService',
      'childDataService',
    ]);

    return (
      <DataService
        ref={this._dataServiceRef}
        requestOnDidMount={trigger === 'onDidMount'}
        queries={serviceQueries}
        dataService={dataService}
      >
        {({ data = [] }) => (
          <AweCascader
            {...props}
            options={data}
            loadData={this._getLoadDataHandler()}
            onFocus={this._focusHandler}
          />
        )}
      </DataService>
    );
  }
}

export default AweApiCascader;
