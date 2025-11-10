import { ScrollView, View } from "react-native";
import WelcomeSection from "../components/WelcomeSection";
import FeaturedSection from "../components/FeaturedSection";
import RaffleEventsSection from "../components/RaffleEventsSection";
import RecentPullsSection from "../components/RecentPullsSection";

export default function Index() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0a0019', zIndex: 10, elevation: 10 }}>
      <ScrollView 
        style={{ flex: 1, zIndex: 10, elevation: 10 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        contentInsetAdjustmentBehavior="never"
      >
        <WelcomeSection />
        <FeaturedSection />
        <RaffleEventsSection />
        <RecentPullsSection />
      </ScrollView>
    </View>
  );
}
