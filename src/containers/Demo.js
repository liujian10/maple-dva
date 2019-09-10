import React from 'react'
import QueueAnim from 'rc-queue-anim'
import styles from './Demo.styl'

const ANIM_SWITCH = {
    // rotate: [0, 270],
    blur: ['0px', '100px'],
    // scaleX: [1, 0],
    // scaleY: [1, 0],
    opacity: [1, 0],
}

const ANIM_PUT_AWAY = {
    bottom: ['50%', -130],
    marginBottom: ['-200px', 0],
    right: ['50%', -180],
    marginRight: ['-250px', 0],
    rotate: [0, 270],
    blur: ['0px', '100px'],
    scaleX: [1, 0.25],
    scaleY: [1, 0.2],
    opacity: [1, 0.5],
}

export default class Demo extends React.Component {
    state={
        showContent: true,
        showTool: false,
        animConfig: ANIM_SWITCH,
    }

    handleClickHideContent = () => {
        this.setState({ showContent: false, animConfig: ANIM_PUT_AWAY }, () => {
            setTimeout(() => {
                this.setState({ showTool: true })
            }, 1000)
        })
    }

    handleClickHideTool = () => {
        this.setState({ showTool: false, animConfig: ANIM_PUT_AWAY }, () => {
            setTimeout(() => {
                this.setState({ showContent: true })
            }, 500)
        })
    }

    handleClickNextContent = () => {
        this.setState({ showContent: false, animConfig: ANIM_SWITCH }, () => {
            setTimeout(() => {
                this.setState({ showContent: true })
            }, 1000)
        })
    }

    render() {
        const { showContent, showTool, animConfig } = this.state
        const animProps = {
            ease: ['easeOutQuart', 'easeInOutQuart'],
            animConfig,
            duration: 1000,
        }
        const toolAnimProps = {
            ease: ['easeInOutQuart', 'easeOutQuart'],
            animConfig: {
                blur: ['0px', '10px'],
                opacity: [1, 0.5],
            },
            duration: 500,
        }
        return (
            <div>
                <div className={styles.modal}>
                    <div className={styles['modal-mask']} />
                    <QueueAnim {...animProps}>
                        {showContent ? [
                            <div key="content" className={styles['modal-content']}>
                                <div className={styles['modal-content-tool']}>
                                    <span onClick={this.handleClickNextContent}>Next</span>
                                    <span onClick={this.handleClickHideContent}>》</span>
                                </div>
                                <div className={styles['modal-content-text']}>内容</div>
                            </div>,
                        ] : null}
                    </QueueAnim>
                </div>
                <QueueAnim {...toolAnimProps}>
                    {showTool && [
                        <div key="tool" className={styles.tool} >
                            <span onClick={this.handleClickHideTool}>《</span>
                            标
                        </div>,
                    ]}
                </QueueAnim>
            </div>
        )
    }
}
