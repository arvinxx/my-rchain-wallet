import React, { Component } from 'react';
import { shuffle } from 'lodash';
import { Tag } from 'antd';
import styles from './index.less';

const { CheckableTag } = Tag;

interface ILabelSelectorProps {
  labels: string[];
  verified: Function;
  clear: boolean;
}
interface ILabelSelectorState {
  selected: string[];
  unselected: string[];
}

export default class LabelSelector extends Component<ILabelSelectorProps, ILabelSelectorState> {
  static defaultProps: ILabelSelectorProps = {
    labels: [],
    verified: () => {},
  };
  shuffled: string[];
  state = {
    selected: [],
    unselected: [],
  };

  componentDidMount(): void {
    this.shuffled = shuffle(this.props.labels);
    this.setState({
      unselected: this.shuffled,
    });
  }
  componentWillUpdate(
    nextProps: Readonly<ILabelSelectorProps>,
    nextState: Readonly<ILabelSelectorState>,
  ): void {
    const { verified, clear } = this.props;
    const { unselected } = this.state;
    const { unselected: nextUnselected } = nextState;
    if (nextUnselected.length === 0 && unselected.length !== nextUnselected.length) {
      verified();
    }
    if (clear !== nextProps.clear) {
      this.setState({
        selected: [],
        unselected: this.shuffled,
      });
    }
  }

  handleSelect(label: string) {
    const { selected, unselected } = this.state;
    const length = selected.length;
    if (label === this.props.labels[length]) {
      this.setState({
        selected: [...selected, label],
        unselected: unselected.filter(text => text !== label),
      });
    }
  }
  handleDeselect(label: string) {
    const { selected, unselected } = this.state;

    this.setState({
      selected: selected.filter(text => text !== label),
      unselected: [...unselected, label],
    });
  }

  render() {
    const { selected, unselected } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.display}>
          {selected &&
            selected.map(label => (
              <CheckableTag
                key={label}
                checked={selected.indexOf(label) > -1}
                onChange={() => this.handleDeselect(label)}
              >
                {label}
              </CheckableTag>
            ))}
        </div>
        <div className={styles.unselected}>
          {unselected.map(label => {
            return (
              <CheckableTag
                className={styles.tag}
                key={label}
                checked={false}
                onChange={() => this.handleSelect(label)}
              >
                {label}
              </CheckableTag>
            );
          })}
        </div>
      </div>
    );
  }
}
