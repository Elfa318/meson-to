import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types';

import MesonTo from '@mesonfi/to'

import styles from './meson2.module.css'
import { ReactComponent as Spinner } from './spinner.svg'

export function MesonToButton ({ appId, isTestnet, type, onCompleted, className, children }) {
  const [pending, setPending] = React.useState(false)

  const meson2 = React.useMemo(() => new MesonTo(window, isTestnet), [])

  const onClick = React.useCallback(() => {
    setPending(true)
    meson2.open(appId, type)
      .then(() => setPending(false))
      .catch(err => {
        console.warn(err)
        setPending(false)
      })
  }, [meson2, appId, type])

  React.useEffect(() => {
    const disposable = meson2.onCompleted(onCompleted)
    return () => disposable.dispose()
  }, [meson2, onCompleted])

  const btnChildren = []
  if (pending) {
    btnChildren.push(React.createElement(Spinner, {
      key: 'spinner',
      className: styles['button-spinner']
    }))
  }
  if (typeof children === 'string') {
    btnChildren.push(children)
  } else if (children) {
    btnChildren.push(React.cloneElement(children, { key: 'text', pending }))
  } else {
    btnChildren.push(pending ? 'Waiting for meson' : 'Deposit with meson')
  }

  return React.createElement('button', {
    onClick,
    className: classnames(
      styles.button,
      pending && styles['button-pending'],
      className
    )
  }, btnChildren)
}

MesonToButton.propTypes = {
  appId: PropTypes.string.isRequired,
  onCompleted: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
}

MesonToButton.defaultProps = {
  appId: 'demo',
  onCompleted: () => {}
}