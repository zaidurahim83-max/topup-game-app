let activeTrxId = null;

async function loadProducts() {
    const res = await fetch('/api/products');
    const json = await res.json();
    if(json.success) {
        const select = document.getElementById('productSelect');
        select.innerHTML = '';
        json.data.forEach(p => {
            select.innerHTML += `<option value="${p.id}" data-game="${p.game_name}" data-item="${p.item_name}" data-price="${p.price}">
                ${p.game_name} - ${p.item_name} (Rp ${p.price.toLocaleString()})
            </option>`;
        });
    }
}

async function checkout() {
    const select = document.getElementById('productSelect');
    const opt = select.options[select.selectedIndex];

    const payload = {
        game: opt.getAttribute('data-game'),
        userId: document.getElementById('userId').value,
        zoneId: document.getElementById('zoneId').value,
        item: opt.getAttribute('data-item'),
        amount: parseInt(opt.getAttribute('data-price')),
        paymentMethod: document.getElementById('paymentMethod').value
    };

    if(!payload.userId) {
        alert('Mohon isi User ID game terlebih dahulu!');
        return;
    }

    const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const json = await res.json();

    if(json.success) {
        activeTrxId = json.transaction_id;
        document.getElementById('resTrxId').innerText = json.transaction_id;
        document.getElementById('resInstruction').innerText = json.payment_details.instruction;

        if(payload.paymentMethod === 'QRIS') {
            document.getElementById('qrisImg').src = json.payment_details.qr_string;
            document.getElementById('qrisContainer').style.display = 'block';
            document.getElementById('vaContainer').style.display = 'none';
        } else {
            document.getElementById('qrisContainer').style.display = 'none';
            document.getElementById('vaContainer').style.display = 'block';
            document.getElementById('vaContainer').innerText = `Nomor VA: ${json.payment_details.virtual_account}`;
        }

        document.getElementById('paymentResult').style.display = 'block';
        loadTransactions();
    }
}

async function simulateSuccess() {
    if(!activeTrxId) return;
    const res = await fetch('/api/simulate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction_id: activeTrxId })
    });
    const json = await res.json();
    if(json.success) {
        alert(json.message);
        document.getElementById('paymentResult').style.display = 'none';
        loadTransactions();
    }
}

async function loadTransactions() {
    const res = await fetch('/api/transactions');
    const json = await res.json();
    if(json.success) {
        const tbody = document.getElementById('trxTableBody');
        tbody.innerHTML = '';
        json.data.forEach(trx => {
            const badgeClass = trx.status === 'Success' ? 'badge-success' : 'badge-pending';
            tbody.innerHTML += `
                <tr>
                    <td>${trx.id}</td>
                    <td><b>${trx.game}</b><br>${trx.item}</td>
                    <td>${trx.user_id} (${trx.zone_id})</td>
                    <td>Rp ${trx.amount.toLocaleString()}</td>
                    <td>${trx.payment_method}</td>
                    <td><span class="badge ${badgeClass}">${trx.status}</span></td>
                </tr>
            `;
        });
    }
}

loadProducts();
loadTransactions();
