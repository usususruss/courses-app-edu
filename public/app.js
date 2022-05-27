const toCurency = price => {
    return new Intl.NumberFormat('en-US', {
        currency: 'USD',
        style: 'currency'
    }).format(price || 0)
}

const toDate = dateStr => {
    return new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(dateStr))
}

const formatPrices = () => {
    document.querySelectorAll('.price').forEach(node => {
        node.textContent = toCurency(parseFloat(node.textContent || 0))
    })
}

const formatDates = () => {
    document.querySelectorAll('.date').forEach(node => {
        node.textContent = toDate(node.textContent)
    })
}

const bindCartListeners = () => {
    const $cart = document.getElementById('cart')

    if ($cart) {
        $cart.addEventListener('click', event => {
            if (event.target.classList.contains('js-remove')) {
                const id = event.target.dataset.id
                const csrf = event.target.dataset.csrf

                const options = {
                    method: 'delete',
                    headers: {
                        'X-XSRF-TOKEN': csrf
                    }
                }

                fetch(`/cart/remove/${id}`, options)
                    .then(async res => {
                        const card = await res.json()
                        const csrf = res.headers.get('csrf')
                        return { csrf, card }
                    })
                    .then(({ card, csrf }) => {
                        if (card.courses.length) {
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
                                    data-csrf='${csrf}'
                                >Remove</button>
                            </td>
                        </tr>
                        `
                                )
                                .join('')
                            $cart.querySelector('tbody').innerHTML = html
                            $cart.querySelector('span.price').textContent = toCurency(card.price)
                        } else {
                            $cart.innerHTML = '<p>Cart is empty</p>'
                        }
                    })
                    .catch(e => {
                        console.log(e)
                    })
            }
        })
    }
}

formatPrices()
formatDates()
bindCartListeners()

M.Tabs.init(document.querySelectorAll('.tabs'))
