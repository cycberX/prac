weights = [15, 20, 35]
profits = [40, 50, 90]
capacity = 60
ratio = [p / w for p, w in zip(profits, weights)]
items = list(zip(weights, profits, ratio))


def get_ratio(item):
    return item[2]


items.sort(key=get_ratio, reverse=True)
total_profit = 0
print("Parcel\tWeight\tProfit\tFraction Taken")
for i, (w, p, r) in enumerate(items):
    if capacity >= w:
        fractions = 1
        capacity -= w
        total_profit += p
    else:
        fractions = capacity / w
        total_profit += p * fractions
        capacity = 0
    print(f"{i + 1}\t{w}\t{p}\t{fractions:.2f}")
    if capacity == 0:
        break
print(f"\n Total Profit: {total_profit:.2f}")
