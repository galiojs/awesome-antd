import React from 'react';
import get from 'lodash.get';
import debounce from 'lodash.debounce';
import shallowequal from 'shallowequal';
import { SelectValue } from 'antd/lib/select';

import { DataService } from './../renderProps/data-service';
import AweSelect, { AweSelectProps } from './../select';

type FieldNames = {
  dataLabel?: string | ((option: any) => string);
  label?: string | ((option: any) => React.ReactChild);
  value?: string | ((option: any) => string);
};

type EnhancedOnChange = (value: SelectValue, option: any, optionElem: React.ReactElement) => void;

export interface AweApiSelectProps extends AweSelectProps {
  /**
   * @deprecated As of release v0.1.3, replaced by {@link #trigger}.
   *   The same as `trigger="onDidMount"`.
   */
  requestOnDidMount?: boolean;

  /**
   * Defaults to `onFocus`
   */
  trigger?: 'onDidMount' | 'onFocus' | 'onSearch';

  dataService?: (q?: any) => any;
  optionWithValue?: boolean;
  fieldNames?: FieldNames;
  disabledOptionValues?: string[];
  dataDependencies?: any[];
}

const DEFAULT_FIELD_NAMES = {
  label: 'label',
  value: 'value',
};

export class AweApiSelect extends React.PureComponent<AweApiSelectProps> {
  static defaultProps: Partial<AweApiSelectProps> = {
    trigger: 'onFocus',
    optionWithValue: false,
    fieldNames: DEFAULT_FIELD_NAMES,
    disabledOptionValues: [],
  };

  componentDidUpdate({ dataDependencies: prevDataDeps }: AweApiSelectProps) {
    const { dataDependencies } = this.props;
    if (!shallowequal(prevDataDeps, dataDependencies)) {
      this._attemptToGetData(true);
    }
  }

  private _dataServiceRef = React.createRef<DataService>();

  private _getChangeHandler(data: any) {
    const { mode, optionWithValue, fieldNames, onChange } = this.props;

    if (typeof onChange !== 'function') {
      return;
    }

    return (value: any, optionElem: any) => {
      if (optionWithValue) {
        let option = data.find(
          (opt: any) =>
            getPropValue(get(fieldNames, 'value', DEFAULT_FIELD_NAMES.value), opt) === value
        );
        if (['multiple', 'tags'].includes(String(mode)) && Array.isArray(value)) {
          option = data.filter((opt: any) =>
            value.includes(getPropValue(get(fieldNames, 'value', DEFAULT_FIELD_NAMES.value), opt))
          );
        }
        (onChange as EnhancedOnChange)(value, option, optionElem);
      } else {
        onChange(value, optionElem);
      }
    };
  }

  private _attemptToGetData = (forced = false, q?: string) => {
    if (!this._dataServiceRef.current) {
      return;
    }
    if (q === undefined) {
      this._dataServiceRef.current.getData(forced);
      return;
    }
    this._dataServiceRef.current.getDataByQ(q, forced);
  };

  private _focusHandler = () => {
    const { trigger } = this.props;
    if (trigger === 'onFocus') {
      this._attemptToGetData();
    }

    const { onFocus } = this.props;
    if (typeof onFocus !== 'function') {
      return;
    }
    onFocus();
  };

  private _searchHandler = (keyword: string) => {
    const { trigger } = this.props;
    if (trigger !== 'onSearch') {
      return;
    }
    this._attemptToGetData(true, keyword);
  };
  private _debouncedSearchHandler = debounce(this._searchHandler, 200);

  render() {
    const {
      requestOnDidMount,
      trigger,
      dataService,
      fieldNames,
      disabledOptionValues,
      ...rest
    } = this.props;

    if (process.env.NODE_ENV === 'development' && requestOnDidMount !== undefined) {
      console.warn(
        `As of release v0.1.3, "requestOnDidMount" was deprecated and this API will be removed in v1.x. Please use "trigger" instead.`
      );
    }

    return (
      <DataService
        ref={this._dataServiceRef}
        requestOnDidMount={(requestOnDidMount && trigger === 'onFocus') || trigger === 'onDidMount'}
        dataService={dataService}
      >
        {({ data = [] }) => (
          <AweSelect
            optionFilterProp="data-label"
            filterOption={defaultFilterOption}
            {...rest}
            onFocus={this._focusHandler}
            onSearch={this._debouncedSearchHandler}
            onChange={this._getChangeHandler(data)}
          >
            {data.map((option: any) => {
              const fieldNameLabel = get(fieldNames, 'label', DEFAULT_FIELD_NAMES.label);
              const fieldNameDataLabel = get(fieldNames, 'dataLabel', fieldNameLabel);
              const fieldNameValue = get(fieldNames, 'value', DEFAULT_FIELD_NAMES.value);
              const label = getPropValue(fieldNameLabel, option);
              const dataLabel = getPropValue(fieldNameDataLabel, option);
              const value = getPropValue(fieldNameValue, option);
              const disabled = (disabledOptionValues as string[]).includes(value);

              return (
                <AweSelect.Option
                  key={value}
                  value={value}
                  disabled={disabled}
                  data-label={dataLabel}
                >
                  {label}
                </AweSelect.Option>
              );
            })}
          </AweSelect>
        )}
      </DataService>
    );
  }
}

export default AweApiSelect;

function getPropValue(prop: string | ((option: any) => React.ReactChild), option: any) {
  return typeof prop === 'function' ? prop(option) : get(option, prop);
}

function defaultFilterOption(inputValue: string, option: any) {
  return String(option.props['data-label'])
    .toLowerCase()
    .includes(String(inputValue).toLowerCase());
}
