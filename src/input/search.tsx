import React from 'react';
import omit from 'lodash.omit';
import AntInput, { SearchProps as AntSearchProps } from 'antd/lib/input';

export interface SearchProps extends AntSearchProps {
  /**
   * Trigger `onSearch` on clear icon clicked or not.
   *
   * > Prerequisite: `allowClear: true`
   * @default true
   */
  allowSearchOnClear: boolean;
}

export class Search extends React.Component<SearchProps> {
  static defaultProps = {
    allowSearchOnClear: true,
  };

  _searchHandler = (
    value: string,
    event?:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<HTMLElement, MouseEvent>
      | undefined
  ) => {
    const { allowClear, allowSearchOnClear, onSearch } = this.props;

    if (!onSearch) {
      return;
    }

    // It's totally a hack here.
    // See: https://github.com/ant-design/ant-design/issues/18729
    if (allowClear && !allowSearchOnClear && event && event.type === 'click') {
      const path = (event as React.MouseEvent<HTMLElement, MouseEvent>).nativeEvent.composedPath();
      const hasClearIcon = path.some((target) => {
        if (target instanceof HTMLElement) {
          return [...target.classList].some((className) => className.endsWith('clear-icon'));
        }
        return false;
      });
      if (hasClearIcon) {
        return;
      }
    }

    onSearch(value, event);
  };

  render() {
    return (
      <AntInput.Search
        {...omit(this.props, ['allowSearchOnClear', 'onSearch'])}
        onSearch={this._searchHandler}
      />
    );
  }
}

export default Search;
