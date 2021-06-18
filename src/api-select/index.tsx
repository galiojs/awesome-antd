import React from 'react';
import get from 'lodash.get';
import debounce from 'lodash.debounce';
import { LabeledValue, SelectValue } from 'antd/lib/select';

import { DataService } from './../renderProps/data-service';
import Select, { SelectProps } from './../select';

export interface FieldNames {
  /**
   * @description Will be used as the selected text and hovering title.
   */
  dataLabel?: string | ((option: any) => string);
  label?: string | ((option: any) => React.ReactChild);
  value?: string | ((option: any) => string);
}

type EnhancedOnChange = (
  value: SelectValue | undefined,
  option: any,
  optionElem: React.ReactElement
) => void;

export interface ApiSelectProps extends Omit<SelectProps, 'options'> {
  /**
   * @deprecated As of release v0.1.3, replaced by {@link #trigger}.
   *   The same as `trigger="onDidMount"`.
   */
  requestOnDidMount?: boolean;

  /**
   * Defaults to `onFocus`
   */
  trigger?: 'onDidMount' | 'onFocus' | 'onSearch';

  /**
   * See [Option With Value](#option-with-value)
   */
  optionWithValue?: boolean;
  fieldNames?: FieldNames;
  disabledOptionValues?: string[];

  /**
   * @deprecated As of release v0.1.8, replaced by {@link #serviceQueries}
   */
  dataDependencies?: any[];
  serviceQueries?: any[];
  dataService: (...qs: any[]) => any;
}

const DEFAULT_FIELD_NAMES = {
  label: 'label',
  value: 'value',
};

export class ApiSelect extends React.PureComponent<ApiSelectProps> {
  static defaultProps = {
    trigger: 'onFocus',
    optionWithValue: false,
    fieldNames: DEFAULT_FIELD_NAMES,
    disabledOptionValues: [],
  };

  private _dataServiceRef = React.createRef<DataService>();

  /**
   * Search keyword reference
   * Help to determine the `notFoundContent`.
   */
  private _keyword = '';

  private _getChangeHandler(data: any) {
    const { mode, labelInValue, optionWithValue, fieldNames, onChange } = this.props;

    if (typeof onChange !== 'function') {
      return;
    }

    return (value: SelectValue | undefined, optionElem: any) => {
      if (!optionWithValue) {
        onChange(value, optionElem);
        return;
      }
      let option;
      if (value === undefined) {
        (onChange as EnhancedOnChange)(value, option, optionElem);
        return;
      }
      if (['multiple', 'tags'].includes(String(mode)) && Array.isArray(value)) {
        let values = value;
        if (labelInValue) {
          values = (value as LabeledValue[]).map(({ key }) => key);
        }
        option = data.filter((opt: any) => {
          const optionValue = getPropValue<string | number>(
            get(fieldNames, 'value', DEFAULT_FIELD_NAMES.value),
            opt
          );

          return (values as (string | number)[]).includes(optionValue);
        });
      } else {
        let key = value as string | number;
        if (labelInValue) {
          key = (value as LabeledValue).key;
        }
        option = data.find((opt: any) => {
          const optionValue = getPropValue(
            get(fieldNames, 'value', DEFAULT_FIELD_NAMES.value),
            opt
          );

          return key === optionValue;
        });
      }
      (onChange as EnhancedOnChange)(value, option, optionElem);
    };
  }

  private _attemptToGetData = (forced = false, q?: string) => {
    if (q === undefined) {
      this._dataServiceRef.current?.getData(forced);
      return;
    }
    this._dataServiceRef.current?.getDataByQ([q], forced);
  };

  private _focusHandler = () => {
    const { trigger } = this.props;
    if (trigger === 'onFocus') {
      this._attemptToGetData();
    }

    this.props.onFocus?.();
  };

  private _searchHandler = (keyword: string) => {
    if (!keyword) {
      return;
    }

    this._keyword = keyword;

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
      fieldNames,
      disabledOptionValues,
      dataDependencies,
      serviceQueries = dataDependencies,
      dataService,
      ...rest
    } = this.props;

    if (process.env.NODE_ENV === 'development') {
      if (requestOnDidMount !== undefined) {
        console.warn(
          `As of release v0.1.3, "requestOnDidMount" was deprecated and this API will be removed in v1.0.0. Please use "trigger" instead.`
        );
      }
      if (dataDependencies !== undefined) {
        console.warn(
          `As of release v0.1.8, "dataDependencies" was deprecated and this API will be removed in v1.0.0. Please use "serviceQueries" instead.`
        );
      }
    }

    return (
      <DataService<any[]>
        ref={this._dataServiceRef}
        requestOnDidMount={(requestOnDidMount && trigger === 'onFocus') || trigger === 'onDidMount'}
        queries={serviceQueries}
        dataService={dataService}
      >
        {({ data = [], requesting }) => {
          const hideNotFoundContent =
            (trigger === 'onSearch' && !this._keyword && data.length <= 0) || requesting;

          return (
            <Select
              showSearch={trigger === 'onSearch'}
              showArrow={trigger !== 'onSearch'}
              optionFilterProp="data-label"
              filterOption={trigger === 'onSearch' ? false : undefined}
              notFoundContent={hideNotFoundContent ? null : undefined}
              {...rest}
              loading={requesting}
              onFocus={this._focusHandler}
              onSearch={this._debouncedSearchHandler}
              onChange={this._getChangeHandler(data)}
            >
              {data.map((option: any) => {
                const fieldNameLabel = get(fieldNames, 'label', DEFAULT_FIELD_NAMES.label);
                const fieldNameValue = get(fieldNames, 'value', DEFAULT_FIELD_NAMES.value);
                const label = getPropValue(fieldNameLabel, option);
                const fieldNameDataLabel = get(fieldNames, 'dataLabel', fieldNameLabel);
                const dataLabel = String(getPropValue(fieldNameDataLabel, option));
                const value = getPropValue(fieldNameValue, option);
                const disabled = (disabledOptionValues as string[]).includes(value);

                return (
                  <Select.Option
                    key={value}
                    value={value}
                    disabled={disabled}
                    title={dataLabel}
                    data-label={dataLabel}
                  >
                    {label}
                  </Select.Option>
                );
              })}
            </Select>
          );
        }}
      </DataService>
    );
  }
}

export default ApiSelect;

function getPropValue<T extends React.ReactChild>(
  prop: string | ((option: any) => T),
  option: any
): T {
  return typeof prop === 'function' ? prop(option) : get(option, prop);
}
