import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styles from './index.scss';

export type action = {
  style?: React.CSSProperties;
  text: string;
  onPress: () => void;
}
interface Props {
  visible?: boolean;
  content: JSX.Element | string;
  contentStyle?: React.CSSProperties;
  actions: action[];
  maskClosable?: boolean;
  closeModal?: () => void;
}

const OperationModal = (props: Props) => {
  const { visible = true, content, actions, contentStyle } = props;
  const onClickMask = e => {
    e.stopPropagation();
    const { maskClosable = false, closeModal } = props;
    if (maskClosable) {
      closeModal && closeModal()
    }
  }
  const renderContent = () => (
    <div className={`${styles['action-modal']} ${visible ? styles.visible : ''}`}>
      <div className={styles['action-modal-mask']} />
      <div className={styles['action-modal-wrap']} onClick={onClickMask} >
        <div className={styles['action-modal-module']}>
          <div className={styles['action-modal-content']} style={contentStyle}>
            {content}
          </div>
          <div className={styles['action-modal-footer']}>
            {actions.length === 2 && (
              <div className={styles['confirm-action']}>
                <a className={styles['modal-button']} style={actions[0].style} onClick={actions[0].onPress}>{actions[0].text}</a>
                <a className={styles['modal-button']} style={actions[1].style} onClick={actions[1].onPress}>{actions[1].text}</a>
              </div>
            )}
            {actions.length !== 2 && (
              <div className={styles['multi-option']}>
                {actions.map(
                  actionItem => (
                    <a className={styles['option-button']} style={actionItem.style} key={actionItem.text} onClick={actionItem.onPress}>{actionItem.text}</a>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  return ReactDOM.createPortal(renderContent(), document.body)
};

export default OperationModal;