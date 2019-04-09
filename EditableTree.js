import React, {Component} from 'react';
import {Tree, Icon} from 'antd';
const {TreeNode} = Tree;

class EditableTree extends Component {

  state = {
    expandedKeys: [],
    data: [
      {
        value: 'Root',
        defaultValue: 'Root',
        key: '0-1',
        parentKey: '0',
        isEditable: false
      }
    ]
  };

  componentDidMount() {
    // Tip: Must have, or the parent node will not expand automatically when you first add a child node
    this.onExpand([]); // 手动触发，否则会遇到第一次添加子节点不展开的Bug
  }

  onExpand = (expandedKeys) => {
    console.log('onExpand', expandedKeys);
    this.setState({expandedKeys: expandedKeys})
  }

  renderTreeNodes = data => data.map((item) => {
    if (item.isEditable) {
      item.title = (
        <div>
          <input
            style={{
            border: 'none',
            borderBottom: '1px solid',
            background: 'none',
            lineHeight: 'normal'
          }}
            value={item.value}
            onChange={(e) => this.onChange(e, item.key)}/>
          <Icon type='close'  style={{marginLeft:10}} onClick={() => this.onClose(item.key, item.defaultValue)}/>
          <Icon type='check'  style={{marginLeft:10}} onClick={() => this.onSave(item.key)}/>
        </div>
      );
    } else {
      if (item.parentKey === '0') {
        item.title = (
          <div>
            <span>
              {item.value}
            </span>
            <Icon  style={{marginLeft:10}}  type='edit' onClick={() => this.onEdit(item.key)}/>
            <Icon  style={{marginLeft:10}}  type='plus' onClick={() => this.onAdd(item.key)}/>
          </div>
        );
      } else {
        item.title = (
          <div>
            <span>
              {item.value}
            </span>
            <Icon  style={{marginLeft:10}}  type='edit' onClick={() => this.onEdit(item.key)}/>
            <Icon  style={{marginLeft:10}} type='plus' onClick={() => this.onAdd(item.key)}/>
            <Icon  style={{marginLeft:10}}  type='minus' onClick={() => this.onDelete(item.key)}/>
          </div>
        );
      }
    }

    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }

    return <TreeNode {...item}/>;
  })

  onAdd = (e) => {
    console.log('add');
    // 防止expandedKeys重复
    // Tip: Must have, expandedKeys should not be reduplicative
    if (this.state.expandedKeys.indexOf(e) === -1) {
      this
        .state
        .expandedKeys
        .push(e);
    }
    this.addNode(e, this.state.data);
    this.setState({expandedKeys: this.state.expandedKeys});
    // 强制刷新UI
    // Tip: Must have, force to refresh UI
    this.forceUpdate();
  }

  addNode = (key, data) => data.map((item) => {
    if (item.key === key) {
      if (item.children) {
        item
          .children
          .push({
            value: 'default',
            defaultValue: 'default',
            key: key + Math.random(100), // 这个 key 应该是唯一的。 Tip: The key should be unique
            parentKey: key,
            isEditable: false
          });
      } else {
        item.children = [];
        item
          .children
          .push({
            value: 'default',
            defaultValue: 'default',
            key: key + Math.random(100),
            parentKey: key,
            isEditable: false
          });
      }
      return;
    }
    if (item.children) {
      this.addNode(key, item.children)
    }
  })

  onDelete = (key) => {
    console.log('delete');
    this.deleteNode(key, this.state.data);
    this.forceUpdate();
  }

  deleteNode = (key, data) => data.map((item, index) => {
    if (item.key === key) {
      data.splice(index, 1);
      return;
    } else {
      if (item.children) {
        this.deleteNode(key, item.children)
      }
    }
  })

  onEdit = (key) => {
    console.log('edit');
    this.editNode(key, this.state.data);
    this.forceUpdate();
  }

  editNode = (key, data) => data.map((item) => {
    if (item.key === key) {
      item.isEditable = true;
    } else {
      item.isEditable = false;
    }
    //Tip: Must have, when a node is editable, and you click a button to make other node editable, the node which you don't save yet will be not editable, and its value should be defaultValue 
    item.value = item.defaultValue; // 当某节点处于编辑状态，并改变数据，点击编辑其他节点时，此节点变成不可编辑状态，value 需要回退到 defaultvalue
    if (item.children) {
      this.editNode(key, item.children)
    }
  })

  onClose = (key, defaultValue) => {
    console.log('close');
    this.closeNode(key, defaultValue, this.state.data);
    this.forceUpdate();
  }

  closeNode = (key, defaultValue, data) => data.map((item) => {
    item.isEditable = false;
    if (item.key === key) {
      item.value = defaultValue;
    }
    if (item.children) {
      this.closeNode(key, defaultValue, item.children)
    }
  })

  onSave = (key) => {
    console.log('save')
    this.saveNode(key, this.state.data);
    this.forceUpdate();
  }

  saveNode = (key, data) => data.map((item) => {
    if (item.key === key) {
      item.defaultValue = item.value;
    }
    if (item.children) {
      this.saveNode(key, item.children)
    }
    item.isEditable = false;
  })

  onChange = (e, key) => {
    console.log('onchange')
    this.changeNode(key, e.target.value, this.state.data);
    this.forceUpdate();
  }

  changeNode = (key, value, data) => data.map((item) => {
    if (item.key === key) {
      item.value = value;
    }
    if (item.children) {
      this.changeNode(key, value, item.children)
    }
  })

  render() {
    return (
      <div>
        <Tree expandedKeys={this.state.expandedKeys} onExpand={this.onExpand}>
          {this.renderTreeNodes(this.state.data)}
        </Tree>
      </div>
    )
  }
}

export default EditableTree;
