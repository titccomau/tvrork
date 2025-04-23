import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { useTheme } from "@/context/theme-context";
import { ChannelCard } from "./ChannelCard";
import { Channel } from "@/types/channel";
import { isTVDevice, getFontSize, getSpacing } from "@/utils/tv-utils";

type CategoryListProps = {
  category: string;
  channels: Channel[];
  onChannelPress: (channelId: string) => void;
  categoryIndex?: number;
};

export function CategoryList({ category, channels, onChannelPress, categoryIndex = 0 }: CategoryListProps) {
  const { colors } = useTheme();
  const isTV = isTVDevice();

  if (channels.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text 
        style={[
          styles.title, 
          { 
            color: colors.text,
            fontSize: isTV ? getFontSize(22) : 20,
            marginBottom: isTV ? getSpacing(16) : 12
          }
        ]}
      >
        {category}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.channelRow}>
          {channels.map((channel, index) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              onPress={() => onChannelPress(channel.id)}
              index={index}
              rowIndex={categoryIndex}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  channelRow: {
    flexDirection: "row",
    gap: 12,
  },
});