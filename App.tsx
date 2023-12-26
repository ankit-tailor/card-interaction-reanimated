import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  View,
  Pressable,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { AnimateHeight } from "./components/AnimatedHeight";
import { Entypo, AntDesign, Feather } from "@expo/vector-icons";
import AnimatedKeyboard from "./components/AnimatedKeyboard";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedAntd = Animated.createAnimatedComponent(AntDesign);
const AnimatedEntypo = Animated.createAnimatedComponent(Entypo);

const SPRING_CONFIG = {
  damping: 6,
  mass: 0.3,
  stiffness: 200,
};

const IMG_SRC =
  "https://www.licious.in/blog/wp-content/uploads/2023/01/Shutterstock_2047827035.jpg";

const POSITION = 60;

const slideLeft = (values: any) => {
  "worklet";
  const animations = {
    originX: withSpring(values.targetOriginX, SPRING_CONFIG),
  };
  const initialValues = {
    originX: values.targetOriginX + POSITION,
  };
  return {
    initialValues,
    animations,
  };
};

const slideUp = (values: any) => {
  "worklet";
  const animations = {
    originY: withSpring(values.targetOriginY, SPRING_CONFIG),
  };
  const initialValues = {
    originY: values.targetOriginY + POSITION,
  };
  return {
    initialValues,
    animations,
  };
};

const slideDown = (values: any) => {
  "worklet";
  const animations = {
    originY: withSpring(values.targetOriginY + POSITION, SPRING_CONFIG),
  };
  const initialValues = {
    originY: values.targetOriginY,
  };
  return {
    initialValues,
    animations,
  };
};

function CardInteraction() {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const inputRef = React.useRef<TextInput>(null);

  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: !isExpanded ? 0 : offsetX.value,
        },
        {
          translateY: !isExpanded ? 0 : offsetY.value,
        },
      ],
    };
  });

  React.useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [isExpanded]);

  const animateActions = () => {
    if (isExpanded) {
      offsetX.value = withSpring(0, SPRING_CONFIG);
      offsetY.value = withSpring(0, SPRING_CONFIG);
      setShowInfo(false);
    } else {
      offsetX.value = withSpring(50, SPRING_CONFIG);
      offsetY.value = withSpring(78, SPRING_CONFIG);
    }
    setIsExpanded((prev) => !prev);
  };

  return (
    <View style={styles.card}>
      <View
        style={{
          gap: 12,
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 16,
            alignItems: "center",
          }}
        >
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: IMG_SRC,
              }}
              style={styles.image}
            />
          </View>
          <View
            style={{
              gap: 4,
            }}
          >
            <Text style={{ color: "#404040", fontSize: 12 }}>Luch</Text>
            <TextInput
              editable={isExpanded}
              style={{
                fontSize: 16,
                color: "#404040",
                fontWeight: "700",
              }}
              ref={inputRef}
              value="Biryani"
            />
          </View>
        </View>
        <AnimateHeight
          hide={!isExpanded}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <Animated.View
              style={styles.button}
              entering={slideUp}
              exiting={slideDown}
            >
              <Text style={styles.text}>Lunch</Text>
            </Animated.View>
            <Animated.View
              style={styles.button}
              entering={slideUp}
              exiting={slideDown}
            >
              <Text style={styles.text}>Snack</Text>
            </Animated.View>
          </View>
        </AnimateHeight>
      </View>
      <View
        style={{
          gap: 12,
          flexDirection: "row",
          position: "relative",
        }}
      >
        {showInfo && (
          <>
            {!isExpanded && (
              <AnimatedPressable
                style={[
                  styles.iconWrapper,
                  {
                    right: 115,
                  },
                ]}
                entering={slideLeft}
              >
                <Feather name="trash-2" size={16} color="#dc2626" />
              </AnimatedPressable>
            )}
            <AnimatedPressable
              style={[
                {
                  paddingHorizontal: 16,
                  height: 32,
                  borderRadius: 20,
                  backgroundColor: "#f1f1f1",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  right: 44,
                },
                animatedStyle,
              ]}
              entering={slideLeft}
              onPress={animateActions}
            >
              {!isExpanded && showInfo ? (
                <Text style={{ fontWeight: "700", color: "#737373" }}>
                  Edit
                </Text>
              ) : (
                <Text style={{ fontWeight: "700", color: "#737373" }}>
                  Done
                </Text>
              )}
            </AnimatedPressable>
          </>
        )}
        {!isExpanded && (
          <AnimatedPressable
            style={[
              styles.iconWrapper,
              {
                right: 0,
              },
            ]}
            onPress={() => {
              setShowInfo((prev) => !prev);
            }}
          >
            {showInfo ? (
              <AnimatedAntd name="close" size={16} color="#737373" />
            ) : (
              <AnimatedEntypo
                name="dots-three-vertical"
                size={12}
                color="#737373"
              />
            )}
          </AnimatedPressable>
        )}
      </View>
    </View>
  );
}

export default function App() {
  return (
    <View
      style={{
        flex: 1,
        padding: 32,
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "#f1f1f1",
      }}
    >
      <SafeAreaView />
      <AnimatedKeyboard>
        <CardInteraction />
      </AnimatedKeyboard>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingVertical: 24,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    backgroundColor: "white",
    borderRadius: 10,
  },
  imageWrapper: {
    backgroundColor: "#f1f1f1",
    padding: 8,
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 10,
  },
  button: {
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 20,
    borderColor: "#737373",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#404040",
    fontWeight: "700",
  },
  iconWrapper: {
    borderRadius: 999,
    height: 32,
    width: 32,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
});
