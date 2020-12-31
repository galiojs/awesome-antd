import React, { createContext, useContext } from 'react';
import Form from 'antd/lib/form';
import Icon from 'antd/lib/icon';
import LocaleReceiver from 'antd/lib/locale-provider/LocaleReceiver';
import ReactResizeDetector from 'react-resize-detector';
import { WrappedFormUtils, GetFieldDecoratorOptions, FormCreateOption } from 'antd/lib/form/Form';
import { FormItemProps } from 'antd/lib/form';

import AweButton from '../button';
import defaultLocale from './../locale/default';

export interface FiltersFormLocal {
  searchText: string;
  resetText: string;
}

export interface FormItem extends FormItemProps {
  id: string;
  decorateOptions?: GetFieldDecoratorOptions;
  control: React.ReactElement;
}

export interface FiltersFormProps<V> {
  form: WrappedFormUtils<V>;
  defaultExpanded: boolean;
  items: FormItem[];
  onSearch(
    fieldsValue: V,
    others: {
      event: React.FormEvent<HTMLFormElement>;
      form: WrappedFormUtils<V>;
    }
  ): void;
  onReset(
    fieldsReset: boolean,
    others: {
      event: React.FormEvent<HTMLFormElement>;
      form: WrappedFormUtils<V>;
    }
  ): void;
}

export interface FiltersFormState {
  expanded: boolean;
}

export class FiltersForm<V extends object> extends React.PureComponent<
  FiltersFormProps<V>,
  FiltersFormState
> {
  // DON'T ADD `: Partial<FiltersFormProps<any>>` annotation.
  // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#caveats
  static defaultProps = {
    defaultExpanded: false,
    onSearch: noop,
    onReset: noop,
  };

  state: FiltersFormState = {
    expanded: this.props.defaultExpanded,
  };

  private _submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { form, onSearch } = this.props;
    onSearch(form.getFieldsValue() as V, { event, form });
  };

  private _resetHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { form, onReset } = this.props;
    form.resetFields();
    onReset(true, { event, form });
  };

  render() {
    const { form, items } = this.props;
    const { expanded } = this.state;

    const { getFieldDecorator } = form!;

    return (
      <ReactResizeDetector handleWidth>
        {({ width }: { width: number }) => {
          const breakpoint = getBreakpoint(width);
          const isCollapsed = items.length > MaxVisibleCountMediaMap[breakpoint];

          return (
            <FiltersFormContext.Provider value={form}>
              <Form
                aria-label="form"
                className={`awe-filters-form awe-filters-form--${
                  expanded ? 'expanded' : 'collapsed'
                } awe-filters-form--${breakpoint}`}
                colon={false}
                layout="inline"
                onSubmit={this._submitHandler}
                onReset={this._resetHandler}
              >
                {items.map(({ id, decorateOptions, control, label, ...itemProps }) => (
                  <Form.Item key={id} label={<span>{label}</span>} {...itemProps}>
                    {getFieldDecorator(
                      id,
                      decorateOptions
                    )(React.cloneElement(control, { style: { width: 200 } }))}
                  </Form.Item>
                ))}
                <LocaleReceiver
                  componentName="FiltersForm"
                  defaultLocale={defaultLocale.FiltersForm}
                >
                  {(locale: FiltersFormLocal) => (
                    <Form.Item>
                      <AweButton aria-label="button: submit" type="primary" htmlType="submit">
                        {locale.searchText}
                      </AweButton>
                      {expanded && (
                        <AweButton
                          aria-label="button: reset"
                          style={{ marginLeft: 8 }}
                          htmlType="reset"
                        >
                          {locale.resetText}
                        </AweButton>
                      )}
                      {isCollapsed && (
                        <AweButton
                          aria-label="button: collapse"
                          style={{ fontSize: 12, marginLeft: 8 }}
                          type="link"
                          onClick={() => {
                            this.setState(({ expanded }) => ({ expanded: !expanded }));
                          }}
                        >
                          {' '}
                          <Icon type={expanded ? 'up' : 'down'} />{' '}
                        </AweButton>
                      )}
                    </Form.Item>
                  )}
                </LocaleReceiver>
              </Form>
            </FiltersFormContext.Provider>
          );
        }}
      </ReactResizeDetector>
    );
  }
}

const MaxVisibleCountMediaMap = {
  xs: 1, // <576px
  sm: 2, // >=576px
  md: 2, // >=768px
  lg: 3, // >=992px
  xl: 3, // >=1200px
  xxl: 4, // >=1600px
  xxxl: 5, // >=1900px
};

function noop() {}

function getBreakpoint(width = window.innerWidth) {
  if (width < 576) {
    return 'xs';
  }
  if (width >= 576 && width < 768) {
    return 'sm';
  }
  if (width >= 768 && width < 992) {
    return 'md';
  }
  if (width >= 992 && width < 1200) {
    return 'lg';
  }
  if (width >= 1200 && width < 1600) {
    return 'xl';
  }
  if (width >= 1600 && width < 1900) {
    return 'xxl';
  }

  // >= 1900
  return 'xxxl';
}

export interface CreateFiltersFormFn {
  <V = {}, E = {}>(options?: FormCreateOption<FiltersFormProps<V> & E>): React.ComponentClass<
    Omit<JSX.LibraryManagedAttributes<typeof FiltersForm, FiltersFormProps<V>>, 'form'> & E
  >;
}

export const createFiltersForm: CreateFiltersFormFn = (options) =>
  Form.create(options)(FiltersForm as any) as any;

const FiltersFormContext = createContext<WrappedFormUtils<any> | undefined>(undefined);

export function useFiltersForm<V>() {
  return useContext(FiltersFormContext) as WrappedFormUtils<V>;
}

const EnhancedFiltersForm = createFiltersForm();

export default EnhancedFiltersForm;
