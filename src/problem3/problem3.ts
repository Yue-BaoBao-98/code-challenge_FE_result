interface WalletBalance {
    currency: string;
    amount: number;
}

//because FormattedWalletBalance is almost the same with WalletBalance
// about the currency, and amount property
// to enhance the code efficiency I did as below
interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    //these useWalletBalances() and usePrices() are not mentioned in the code. They might be custom hooks or functions?
    //I could not sure about the return value they will give.
    const balances = useWalletBalances();
    const prices = usePrices();

    const getPriority = (blockchain: any): number => {
        switch (blockchain) {
            case 'Osmosis':
                return 100;
            case 'Ethereum':
                return 50;
            case 'Arbitrum':
                return 30;
            //both Zilliqa and Neo return the same value 20, to improve I did as below
            case 'Zilliqa':
            case 'Neo':
                return 20;
            default:
                return -99;
        }
    };

    const sortedBalances = useMemo(() => {
        return balances
            .filter((balance: WalletBalance) => {
                //Property 'blockchain' does not exist on type "WalletBalance" in 'balance.blockchain'.
                //this might be balance.currency
                // const balancePriority = getPriority(balance.blockchain);
                const balancePriority = getPriority(balance.currency);
                //lhsPriority is not defined or mentioned in any of the above code
                //this might be a typo when coding and it must be balancePriority.
                // if (lhsPriority > -99) {
                if (balancePriority > -99) {
                    if (balance.amount <= 0) {
                        return true;
                    }
                }
                return false;
            })
            .sort((lhs: WalletBalance, rhs: WalletBalance) => {
                //The same with the above issue; property 'blockchain' does not exist on type "WalletBalance" in 'balance.blockchain'.
                //this might be <variable>.currency
                // const leftPriority = getPriority(lhs.blockchain);
                // const rightPriority = getPriority(rhs.blockchain);
                const leftPriority = getPriority(lhs.currency);
                const rightPriority = getPriority(rhs.currency);
                //the below code does not consider about the case where leftPriority = rightPriority
                if (leftPriority > rightPriority) {
                    return -1;
                } else if (rightPriority > leftPriority) {
                    return 1;
                }
            });
    }, [balances, prices]);

    const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
        return {
            ...balance,
            formatted: balance.amount.toFixed(),
        };
    });

    const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
            <WalletRow
                className={classes.row}
                key={index}
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={balance.formatted}
            />
        );
    });

    return <div {...rest}>{rows}</div>;
};
