import React from 'react';
import TreeSelect from 'antd/lib/tree-select';
import { TreeNodeValue, TreeSelectProps } from 'antd/lib/tree-select/interface';

interface FieldNames {
  value?: string | ((treeNodeData: any) => string | number);
  title?: string | ((treeNodeData: any) => React.ReactChild);
  children?: string | ((treeNodeData: any) => any[]);
  disabled?: string | ((treeNodeData: any) => boolean);
  disableCheckbox?: string | ((treeNodeData: any) => boolean);
  selectable?: string | ((treeNodeData: any) => boolean);
  checkable?: string | ((treeNodeData: any) => boolean);
}

export interface AweTreeSelectProps<T extends TreeNodeValue> extends TreeSelectProps<T> {
  fieldNames?: FieldNames;
}

export class AweTreeSelect<T extends TreeNodeValue> extends React.PureComponent<
  AweTreeSelectProps<T>
> {
  render() {
    const { fieldNames, treeData, ...rest } = this.props;

    if (fieldNames === undefined) {
      return <TreeSelect treeData={treeData} {...rest} />;
    }

    return <TreeSelect {...rest}>{generateLoop(fieldNames)(treeData)}</TreeSelect>;
  }
}

export default AweTreeSelect;

function generateLoop({
  value = 'value',
  title = 'title',
  children = 'children',
  disabled = 'disabled',
  disableCheckbox = 'disableCheckbox',
  selectable = 'selectable',
  checkable = 'checkable',
}: FieldNames) {
  const loop = (treeData?: any[]) => {
    if (!(Array.isArray(treeData) && treeData.length)) {
      return;
    }

    return treeData.map((treeNodeData: any) => {
      const treeNodeProps = {
        value: getTreeNodePropValue<string>(treeNodeData, value),
        title: getTreeNodePropValue<React.ReactChild>(treeNodeData, title),
        children: getTreeNodePropValue<any[]>(treeNodeData, children),
        disabled: getTreeNodePropValue<boolean>(treeNodeData, disabled),
        disableCheckbox: getTreeNodePropValue<boolean>(treeNodeData, disableCheckbox),
        selectable: getTreeNodePropValue<boolean>(treeNodeData, selectable),
        checkable: getTreeNodePropValue<boolean>(treeNodeData, checkable),
      };

      if (!(Array.isArray(treeNodeProps.children) && treeNodeProps.children.length)) {
        return <TreeSelect.TreeNode key={treeNodeProps.value} {...treeNodeProps} />;
      }

      return (
        <TreeSelect.TreeNode key={treeNodeProps.value} {...treeNodeProps}>
          {loop(treeNodeProps.children)}
        </TreeSelect.TreeNode>
      );
    });
  };

  return loop;
}

function getTreeNodePropValue<P>(treeNodeData: any, fieldName: string | Function): P | undefined {
  if (typeof fieldName == 'string') {
    return treeNodeData[fieldName];
  }

  if (typeof fieldName == 'function') {
    return fieldName(treeNodeData);
  }
}
