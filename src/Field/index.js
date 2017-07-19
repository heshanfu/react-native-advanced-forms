import React, { Component, PropTypes, Children, cloneElement } from 'react'
import { View } from 'react-native'

import LabelGroup from '../LabelGroup'
import Label from '../Label'
import styles from './styles'

export default class Field extends Component {
  constructor (props, ctx) {
    super(props, ctx)

    this.state = {
      showFieldError: false
    }
  }

  render () {
    const {
      name,
      labelText,
      labelStyle,
      labelTextStyle,
      labelRightContent,
      style,
      onChange,
      onSubmit,
      children
    } = this.props

    const { showFieldError } = this.state

    const onlyChild = Children.only(children)

    const { onChange: onChildChange } = onlyChild.props

    const kid = cloneElement(onlyChild, {
      ref: 'child',
      showFieldError,
      onSubmit: () => {
        this.setState({
          showFieldError: false
        }, () => {
          onSubmit && onSubmit(name)
        })
      },
      onChange: (value) => {
        // remove error highlight
        this.setState({
          showFieldError: false
        }, () => {
          // child's own change handler
          onChildChange && onChildChange(value)
          // parent form change handler
          onChange && onChange(name, value)
        })
      }
    })

    // render the label
    const renderedLabel = (!label) ? null : (
      <LabelGroup>
        <Label style={labelStyle} textStyle={labelTextStyle}>{label}</Label>
        {labelRightContent}
      </LabelGroup>
    )

    // render it all
    return (
      <View style={style || styles.container}>
        {renderedLabel}{kid}
      </View>
    )
  }

  unfocusFields () {
    this.getChild().unfocus && this.getChild().unfocus()
  }

  focusField (name) {
    if (this.props.name === name) {
      this.getChild().focus && this.getChild().focus()
    }
  }

  showFieldError (name, err) {
    if (this.props.name === name) {
      this.setState({
        showFieldError: err
      })
    }
  }

  collectFieldValues (obj) {
    obj[this.props.name] = this.getChild().getValue()
  }

  getChild () {
    const { child } = this.refs

    return (child.getWrappedInstance)
      ? child.getWrappedInstance()
      : child
  }
}

Field.propTypes = {
  name: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  labelText: PropTypes.string,
  labelStyle: PropTypes.object,
  labelTextStyle: PropTypes.object,
  labelRightContent: PropTypes.object,
  style: PropTypes.object,
}
