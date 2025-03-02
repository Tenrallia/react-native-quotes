import { useCallback, memo, useRef, useEffect } from "react";
import { Text } from "@react-navigation/elements";
import { FlatList, Animated } from "react-native";
import styled from "styled-components/native";

type QuotesData = {
  symbol: string;
  price: string;
  bestBidPrice: string;
  bestAskPrice: string;
  bestAskSize: string;
};

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

const Spacer = styled.View<{
  size?: number;
}>`
  height: ${({ size = 16 }) => size}px;
`;

const Row = styled.View`
  flex-direction: row;
  background-color: #0388fc;
`;

const Cell = styled.View`
  width: 70px;
  background-color: #c1def7;
  margin: 1px;
  padding: 2px;
  justify-content: center;
`;

const HeadText = styled.Text`
  font-weight: bold;
`;

const AnimatedCell = styled(Animated.Text)`
  font-size: 12px;
`;

const QuotesTable = ({ data }: { data: QuotesData[] }) => {
  const animatedValues = useRef({}).current;
  const previousValues = useRef({}).current;

  useEffect(() => {
    data.forEach((item: QuotesData) => {
      if (!animatedValues[item.symbol]) {
        animatedValues[item.symbol] = {
          price: new Animated.Value(0),
          bestBidPrice: new Animated.Value(0),
          bestAskPrice: new Animated.Value(0),
          bestAskSize: new Animated.Value(0),
        };
        previousValues[item.symbol] = {
          price: Number(item.price),
          bestBidPrice: Number(item.bestBidPrice),
          bestAskPrice: Number(item.bestAskPrice),
        };
      }

      const updateValue = (key: string, newValue: number) => {
        const prevValue = previousValues[item.symbol][key];
        if (prevValue === newValue) return; // Если значение не изменилось, не анимируем

        const direction =
          newValue > prevValue ? 1 : newValue < prevValue ? -1 : 0; // 1 - рост, -1 - падение, 0 - без изменений

        Animated.timing(animatedValues[item.symbol][key], {
          toValue: direction,
          duration: 500,
          useNativeDriver: false,
        }).start(() => {
          Animated.timing(animatedValues[item.symbol][key], {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }).start(() => {
            previousValues[item.symbol][key] = newValue;
          });
        });
      };

      updateValue("price", Number(item.price));
      updateValue("bestBidPrice", Number(item.bestBidPrice));
      updateValue("bestAskPrice", Number(item.bestAskPrice));
      updateValue("bestAskSize", Number(item.bestAskSize));
    });
  }, [data]);

  const getColor = (animatedValue: Animated.Value) => {
    return animatedValue.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: ["red", "black", "green"],
    });
  };

  const renderItem = useCallback(({ item }: { item: QuotesData }) => {
    const { symbol, price, bestBidPrice, bestAskPrice, bestAskSize } = item;

    const formattedSymbol = Array.from(symbol).slice(0, -8).join("");

    const animatedPrice =
      animatedValues[item.symbol]?.price ||
      new Animated.Value(Number(item.price) || 0);
    const animatedBestBid =
      animatedValues[item.symbol]?.bestBidPrice ||
      new Animated.Value(Number(item.bestBidPrice) || 0);
    const animatedBestAsk =
      animatedValues[item.symbol]?.bestAskPrice ||
      new Animated.Value(Number(item.bestAskPrice) || 0);
    const animatedBestSize =
      animatedValues[item.symbol]?.bestAskSize ||
      new Animated.Value(Number(item.bestAskSize) || 0);

    return (
      <Row>
        <Cell>
          <AnimatedCell>{formattedSymbol}</AnimatedCell>
        </Cell>
        <Cell>
          <AnimatedCell style={{ color: getColor(animatedPrice) }}>
            {price}
          </AnimatedCell>
        </Cell>
        <Cell>
          <AnimatedCell style={{ color: getColor(animatedBestBid) }}>
            {bestBidPrice}
          </AnimatedCell>
        </Cell>
        <Cell>
          <AnimatedCell style={{ color: getColor(animatedBestAsk) }}>
            {bestAskPrice}
          </AnimatedCell>
        </Cell>
        <Cell>
          <AnimatedCell style={{ color: getColor(animatedBestSize) }}>
            {bestAskSize}
          </AnimatedCell>
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

  return (
    <>
      <ContainerWithBorder>
        <Text>Name - Symbol</Text>
        <Text>BP - Best Bid Price</Text>
        <Text>AP - Best Ask Price</Text>
        <Text>AS - Best Ask Size</Text>
      </ContainerWithBorder>

      <Spacer />

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={true}
        ListHeaderComponent={renderHeader}
      />
    </>
  );
};

export default memo(QuotesTable);
