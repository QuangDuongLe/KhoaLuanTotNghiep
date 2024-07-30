import { Spin } from 'antd'
import React from 'react'

const Loading = ({children, isLoading}) => {
    return (        
    <Spin spinning={isLoading} >
        {children}
    </Spin>)
}
export default Loading