import { ScrollView, View } from "react-native";
import { useState, useEffect } from "react";
import WelcomeSection from "../components/WelcomeSection";
import FeaturedSection from "../components/FeaturedSection";
import RaffleEventsSection from "../components/RaffleEventsSection";
import RecentPullsSection from "../components/RecentPullsSection";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

export default function Index() {
  const { user } = useAuth();
  const [username, setUsername] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (user) {
      fetchUsername();
    }
  }, [user]);

  const fetchUsername = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      setUsername(profile?.username || user.email?.split('@')[0] || undefined);
    } catch (error) {
      console.error('Error fetching username:', error);
      setUsername(user.email?.split('@')[0] || undefined);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0019', zIndex: 10, elevation: 10 }}>
      <ScrollView 
        style={{ flex: 1, zIndex: 10, elevation: 10 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        contentInsetAdjustmentBehavior="never"
      >
        <WelcomeSection userName={username} />
        <FeaturedSection />
        <RaffleEventsSection />
        <RecentPullsSection />
      </ScrollView>
    </View>
  );
}
