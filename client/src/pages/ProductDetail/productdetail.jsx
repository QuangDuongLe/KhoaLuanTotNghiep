import React, { useEffect } from "react"
import ProductDetailComponents from "../../Components/ProductDetailCom/ProductDetailComponent";

const ProductDetail = () => {
    
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" })
    }, [])
    return (
        <div style={{ padding: '3%', background: '#efefef', height: 'auto' }}>
            <ProductDetailComponents />
        </div>
    )
}

export default ProductDetail;