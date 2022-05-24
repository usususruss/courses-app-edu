const toCurency = price => {
    return new Intl.NumberFormat('en-US', {
        currency: 'USD',
        style: 'currency'
    }).format(price || 0)
}

const formatPrices = () => {
    document.querySelectorAll('.price').forEach(node => {
        node.textContent = toCurency(parseFloat(node.textContent || 0))
    })
}

const bindCartListeners = () => {
    const $card = document.getElementById('card')

    if ($card) {
        $card.addEventListener('click', event => {
            if (event.target.classList.contains('js-remove')) {
                const id = event.target.dataset.id
                console.log(id)

                fetch(`/card/remove/${id}`, { method: 'delete' })
                    .then(res => res.json())
                    .then(card => {
                        if (card.courses.length) {
                            console.log('card.courses', card.courses)

                            const html = card.courses
                                .map(
                                    c => `
                        <tr>
                            <td>${c.title}</td>
                            <td>${c.count}</td>
                            <td>
                                <button
                                    class='btn btn-small js-remove'
                                    data-id='${c.id}'
                                >Remove</button>
                            </td>
                        </tr>
                        `
                                )
                                .join('')
                            $card.querySelector('tbody').innerHTML = html
                            $card.querySelector('span.price').textContent = toCurency(card.price)
                        } else {
                            $card.innerHTML = '<p>Cart is empty</p>'
                        }
                    })
                    .catch(() => {})
            }
        })
    }
}

formatPrices()
bindCartListeners()
