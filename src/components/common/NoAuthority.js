import React from 'react'
import noAuthority from '@/images/page/noAuthority.png'

import style from './NoAuthority.styl'

export default () => (
    <div className={style.main}>
        <img src={noAuthority} alt="noAuthority" />
        <div>抱歉，您暂时无权限访问</div>
    </div>
)
