import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from "react-native-reanimated";

export default function AnimatedKeyboard({ children }: any) {
  const keyboard = useAnimatedKeyboard();
  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -keyboard.height.value / 3,
        },
      ],
    };
  });

  return <Animated.View style={translateStyle}>{children}</Animated.View>;
}
