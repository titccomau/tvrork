import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, FlatList, ActivityIndicator, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/theme-context";
import { usePlaylistStore } from "@/store/playlist-store";
import { ChannelListItem } from "@/components/ChannelListItem";
import { Search, X } from "lucide-react-native";
import { Channel } from "@/types/channel";
import { Footer } from "@/components/Footer";
import { isTVDevice, getFontSize, getSpacing } from "@/utils/tv-utils";
import { TVFocusable } from "@/components/TVFocusable";

export default function SearchScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { playlists } = usePlaylistStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Channel[]>([]);
  const isTV = isTVDevice();

  // Get all channels once and memoize them
  const allChannels = React.useMemo(() => {
    return playlists.flatMap(playlist => playlist.channels || []);
  }, [playlists]);

  // Track if we're currently searching
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsSearching(true);
      
      // Simulate search delay
      const timer = setTimeout(() => {
        const results = allChannels.filter(channel => 
          channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          channel.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(results);
        setIsSearching(false);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allChannels]);

  const handleChannelPress = (channelId: string) => {
    router.push(`/player?id=${channelId}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  // Render clear button based on platform
  const renderClearButton = () => {
    if (!searchQuery.length) return null;
    
    if (isTV) {
      return (
        <TVFocusable
          style={styles.clearButton}
          onPress={clearSearch}
        >
          <X size={24} color={colors.text} />
        </TVFocusable>
      );
    }

    return (
      <Pressable onPress={clearSearch} style={styles.clearButton}>
        <X size={20} color={colors.text} />
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom"]}>
      <View style={[
        styles.searchContainer, 
        { 
          backgroundColor: colors.card,
          height: isTV ? 60 : 48,
          margin: isTV ? getSpacing(24) : 16
        }
      ]}>
        <Search size={isTV ? 24 : 20} color={colors.text} style={styles.searchIcon} />
        <TextInput
          style={[
            styles.searchInput, 
            { 
              color: colors.text,
              fontSize: isTV ? getFontSize(18) : 16,
              height: isTV ? 60 : 48
            }
          ]}
          placeholder="Search channels..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {renderClearButton()}
      </View>

      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={isTV ? "large" : "large"} color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <ChannelListItem
              channel={item}
              onPress={() => handleChannelPress(item.id)}
              index={index}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            isTV && { 
              padding: getSpacing(24),
              paddingTop: 0
            }
          ]}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[
                styles.emptyText, 
                { 
                  color: colors.text,
                  fontSize: isTV ? getFontSize(18) : 16
                }
              ]}>
                {searchQuery.length > 0
                  ? "No channels found matching your search."
                  : "Search for channels by name or category."}
              </Text>
            </View>
          }
          ListFooterComponent={<Footer />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
});