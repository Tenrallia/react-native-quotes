import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Text } from "@react-navigation/elements";
import {
  View,
  FlatList,
  ActivityIndicator,
  Animated,
  useAnimatedValue,
} from "react-native";
import styled from "styled-components/native";

const API_URL = "https://futures-api.poloniex.com/api/v2/tickers";

type QuotesData = {
  symbol: string;
  price: string;
  bestBidPrice: string;
  bestAskPrice: string;
  bestAskSize: string;
};

const Container = styled.View`
  flex: 1;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding: 16px 8px;
`;

// const ContentContainer = styled.View`
//   flex: 1;
//   width: 100%;
//   background-color: green;
// `;

const ErrorContainer = styled.View`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const ContainerWithBorder = styled.View`
  width: 70%;

  align-items: center;
  justify-content: center;
  padding: 16px;
  align-self: center;

  border-color: #0388fc;
  border-width: 1px;
  border-radius: 8px;
`;

const AbsoluteView = styled(ContainerWithBorder)`
  position: absolute;
  z-index: 2;
  top: 16;
`;

const Spacer = styled.View<{
  size?: number;
}>`
  height: ${({ size = 16 }) => size}px;
`;

// Table styles

const Row = styled.View`
  flex-direction: row;
  background-color: #0388fc;
`;

const Cell = styled.View<{
  width?: number;
}>`
  width: ${({ width = 70 }) => width}px;
  background-color: #c1def7;
  margin: 1px;
  padding: 2px;
  justify-content: center;
`;

const HeadText = styled.Text`
  font-weight: bold;
`;

const DataText = styled.Text`
  font-size: 12px;
`;

const QuotesScreen = () => {
  const [quotesData, setQuotesData] = useState([]);
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    try {
      console.log("getData");
      const response = await fetch(API_URL)
        // .then(() => {
        //   throw "kjhbj";
        // })
        .then((res) => res.json())
        .then((results) => {
          setQuotesData(results["data"]);
          if (error) {
            setError(null);
          }
        });
    } catch (e) {
      setError("Ошибка загрузки данных. \n\n Пожалуйста подождите.");
      setQuotesData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      // fetchData();

      let interval = setInterval(fetchData, 5000);

      console.log("quotesData", quotesData);

      return () => {
        clearInterval(interval);
      };
    }, [])
  );

  const renderItem = useCallback(({ item }: { item: QuotesData }) => {
    const { symbol, price, bestBidPrice, bestAskPrice, bestAskSize } = item;

    const formattedSymbol = Array.from(symbol).slice(0, -8).join("");

    return (
      <Row>
        <Cell>
          <DataText>{formattedSymbol}</DataText>
        </Cell>
        <Cell>
          <DataText>{price}</DataText>
        </Cell>
        <Cell>
          <DataText>{bestBidPrice}</DataText>
        </Cell>
        <Cell>
          <DataText>{bestAskPrice}</DataText>
        </Cell>
        <Cell>
          <DataText>{bestAskSize}</DataText>
        </Cell>
      </Row>
    );
  }, []);

  const renderHeader = useCallback(() => {
    const objOfTitles = {
      symbol: "Name",
      price: "Price",
      bestBidPrice: "BP",
      bestAskPrice: "AP",
      bestAskSize: "AS",
    };
    const tempArray = Object.values(objOfTitles);

    return (
      <Row>
        {tempArray.map((val, index) => (
          <Cell key={`head-cell-${index}`}>
            <HeadText>{val}</HeadText>
          </Cell>
        ))}
      </Row>
    );
  }, []);

  const renderError = useMemo(
    () => (
      <ErrorContainer>
        <AbsoluteView>
          <Text>{error}</Text>
        </AbsoluteView>
        <ActivityIndicator size="large" color="#0388fc" />
      </ErrorContainer>
    ),
    [error]
  );

  return (
    <Container>
      {error ? (
        renderError
      ) : !loading && quotesData.length > 0 ? (
        <>
          <ContainerWithBorder>
            <Text>Name - Symbol</Text>
            <Text>BP - Best Bid Price</Text>
            <Text>AP - Best Ask Price</Text>
            <Text>AS - Best Ask Size</Text>
          </ContainerWithBorder>

          <Spacer />

          <FlatList
            data={quotesData}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            showsHorizontalScrollIndicator={true}
            ListHeaderComponent={renderHeader}
          />
        </>
      ) : (
        <ActivityIndicator size="large" color="#0388fc" />
      )}
    </Container>
  );
};

export default memo(QuotesScreen);
