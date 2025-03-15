<!DOCTYPE html>
<html>
<head>
    <title>Laporan Keuangan - {{ $month }} {{ $year }}</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f8f9fa; }
        .amount { text-align: right; }
        .income { color: green; }
        .expense { color: red; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laporan Keuangan</h1>
        <h2>{{ $month }} {{ $year }}</h2>
    </div>

    <div class="summary">
        <h3>Ringkasan</h3>
        <p>Total Pemasukan: Rp {{ number_format($income, 0, ',', '.') }}</p>
        <p>Total Pengeluaran: Rp {{ number_format($expense, 0, ',', '.') }}</p>
        <p>Saldo: Rp {{ number_format($income - $expense, 0, ',', '.') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Tanggal</th>
                <th>Kategori</th>
                <th>Deskripsi</th>
                <th>Jumlah</th>
            </tr>
        </thead>
        <tbody>
            @foreach($transactions as $transaction)
            <tr>
                <td>{{ \Carbon\Carbon::parse($transaction->date)->format('d/m/Y') }}</td>
                <td>{{ $transaction->category->name }}</td>
                <td>{{ $transaction->description }}</td>
                <td class="amount {{ $transaction->type }}">
                    Rp {{ number_format($transaction->amount, 0, ',', '.') }}
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>