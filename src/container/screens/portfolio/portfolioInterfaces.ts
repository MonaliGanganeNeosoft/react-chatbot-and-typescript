export interface PorfolioStateProps {
  portfolioDetails: PorfolioDetailsProps;
}

export interface PorfolioDetailsProps {
  userTokenList: UserTokenListProps[];
}

export interface UserTokenListProps {
  tokenId: string;
  balance: string;
  name: string;
  symbol: string;
}
