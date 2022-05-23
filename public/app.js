const priceFormatter = new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency'
})

document.querySelectorAll('.price').forEach(node => {
    node.textContent = priceFormatter.format(parseFloat(node.textContent || 0))
})
