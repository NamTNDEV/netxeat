import OrderHistoryCart from "./order-history-cart"

const OrderHistoryPage = () => {
    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-6 md:py-8">
            <h1 className="text-center text-2xl font-bold mb-6 md:mb-8">Lịch sử đơn hàng</h1>
            <OrderHistoryCart />
        </div>
    )
}

export default OrderHistoryPage