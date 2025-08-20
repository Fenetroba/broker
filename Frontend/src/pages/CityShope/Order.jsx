import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProductsById } from '../../store/ProductSlice'
import { createOrder } from '../../store/OrderSlice'

const Currency = ({ value }) => <span>{Number(value || 0).toFixed(2)} Birr</span>

const Order = () => {
  // Treat :id as productId for creating an order
  const { id: productId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { currentProduct, status: productStatus, error: productError } = useSelector((s) => s.products)
  const { status: orderStatus, error: orderError } = useSelector((s) => s.orders)

  const [qty, setQty] = useState(1)
  const [shipping, setShipping] = useState({ address: '', city: '', postalCode: '', country: '' })
  const [paymentMethod, setPaymentMethod] = useState('CashOnDelivery')

  useEffect(() => {
    if (productId) dispatch(fetchProductsById(productId))
  }, [productId, dispatch])

  const subtotal = useMemo(() => (currentProduct?.price || 0) * qty, [currentProduct?.price, qty])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!currentProduct?._id) return
    const payload = {
      orderItems: [
        {
          product: currentProduct._id,
          name: currentProduct.product_name || currentProduct.name,
          image: currentProduct.image || currentProduct.images?.[0],
          price: currentProduct.price,
          quantity: qty,
        },
      ],
      shippingAddress: shipping,
      paymentMethod,
    }

    const res = await dispatch(createOrder(payload))
    if (res.meta.requestStatus === 'fulfilled') {
      // Redirect to home or any confirmation page
      navigate('/city_shop/home')
    }
  }

  if (!productId) return <div className="p-4">No product selected.</div>
  if (productStatus === 'loading' && !currentProduct) return <div className="p-4">Loading product...</div>
  if (productError) return <div className="p-4 text-red-600">{productError}</div>

  return (
     <section className='bg-[var(--two1m)] h-[100vh] flex  justify-center flex-col'>

    <div className="p-4 max-w-3xl bg-[var(--two5m)] rounded-lg   mx-auto space-y-6">
      <h1 className="text-2xl  font-bold">CREATE ORDER</h1>

      <form onSubmit={onSubmit} className="grid md:grid-cols-3 gap-4">
        <section className="md:col-span-2 space-y-4">
          <div className="border  rounded p-6 bg-[var(--two2m)]  text-white flex gap-4">
            {currentProduct?.image && (
              <img src={currentProduct.image} alt={currentProduct.name} className="w-20 h-20 object-cover rounded" />
            )}
            <div>
              <div className="font-semibold text-lg">{currentProduct?.product_name || currentProduct?.name}</div>
              <div className="text-sm ">Price: <Currency value={currentProduct?.price} /></div>
            <div className="flex items-center gap-2 mt-3">
            <label className="block mt-2 text-sm">Quantity</label>
            <input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} className="bg-[var(--two5m)] text-black border rounded px-2 py-1 w-24" />
            </div>
            </div>
          </div>

          <div className="border rounded p-6 bg-[var(--two2m)]  text-white">
            <h2 className="font-semibold mb-2">Shipping Address</h2>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <input required placeholder="Address" className="border rounded px-2 py-2" value={shipping.address} onChange={(e)=>setShipping(p=>({...p,address:e.target.value}))} />
              <input required placeholder="City" className="border rounded px-2 py-2" value={shipping.city} onChange={(e)=>setShipping(p=>({...p,city:e.target.value}))} />
              <input required placeholder="Postal Code" className="border rounded px-2 py-2" value={shipping.postalCode} onChange={(e)=>setShipping(p=>({...p,postalCode:e.target.value}))} />
              <input required placeholder="Country" className="border rounded px-2 py-2" value={shipping.country} onChange={(e)=>setShipping(p=>({...p,country:e.target.value}))} />
            </div>
          </div>

          <div className="border rounded p-4">
            <h2 className="font-semibold mb-2">Payment Method</h2>
            <select className="border rounded px-2 py-2" value={paymentMethod} onChange={(e)=>setPaymentMethod(e.target.value)}>
              <option value="CashOnDelivery">Cash on Delivery</option>
              <option value="PayPal">PayPal</option>
              <option value="Stripe">Stripe</option>
            </select>
          </div>
        </section>

        <aside className="border rounded p-4 h-fit space-y-2">
          <h2 className="font-semibold">Summary</h2>
          <div className="flex justify-between text-sm"><span>Subtotal</span><span><Currency value={subtotal} /></span></div>
          <button type="submit" disabled={orderStatus==='loading'} className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2">
            {orderStatus==='loading' ? 'Creating...' : 'Create Order'}
          </button>
          {orderError && <div className="text-sm text-red-600">{orderError}</div>}
        </aside>
      </form>
    </div>
     </section>
  )
}

export default Order