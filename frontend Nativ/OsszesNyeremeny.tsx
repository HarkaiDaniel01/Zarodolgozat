import React, { useState, useEffect, JSX } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Cim from './Cim';
import { useTheme } from './ThemeContext';
import { rf } from './theme';

interface OsszesNyeremenyProps {
  onBack: () => void;
}

interface WinningItem {
  Eredmenyek_id: number;
  kategoria_nev: string;
  Eredmenyek_datum: string;
  Eredmenyek_pont: number;
}

const formatDate = (raw: string): string => {
  try {
    const d = new Date(raw);
    return d.toLocaleDateString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return raw;
  }
};

const CARD_COLORS = [
  { bg: '#F3E5F5', icon: '#9C27B0' },
  { bg: '#E8EAF6', icon: '#3F51B5' },
  { bg: '#E0F7FA', icon: '#00838F' },
  { bg: '#FFF3E0', icon: '#E65100' },
  { bg: '#FCE4EC', icon: '#C2185B' },
  { bg: '#E8F5E9', icon: '#2E7D32' },
];

const OsszesNyeremeny: React.FC<OsszesNyeremenyProps> = ({ onBack }) => {
  const { colors, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const styles = getStyles(colors, isDark, width);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<WinningItem[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (): Promise<void> => {
    try {
      const userId = await AsyncStorage.getItem('userid');
      if (!userId) return;

      const response = await fetch(`${Cim.Cim}/eredmenyek`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jatekosId: userId }),
      });

      if (response.ok) {
        const json = await response.json();
        setData(json);
      }
    } catch (error) {
      console.error('Error fetching winnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPont = data.reduce((sum, item) => sum + (item.Eredmenyek_pont || 0), 0);
  const legjobb = data.length ? Math.max(...data.map(i => i.Eredmenyek_pont)) : 0;

  const renderItem = ({ item, index }: { item: WinningItem; index: number }): JSX.Element => {
    const color = CARD_COLORS[index % CARD_COLORS.length];
    return (
      <View style={[styles.card, { borderLeftColor: color.icon }]}>
        <View style={[styles.iconContainer, { backgroundColor: color.bg }]}>
          <MaterialCommunityIcons name="trophy" size={22} color={color.icon} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.kategoria_nev}</Text>
          <View style={styles.dateRow}>
            <MaterialCommunityIcons name="calendar-outline" size={12} color={colors.text_secondary} />
            <Text style={styles.cardDate}> {formatDate(item.Eredmenyek_datum)}</Text>
          </View>
        </View>
        <View style={[styles.amountBadge, { backgroundColor: color.bg }]}>
          <Text style={[styles.amountText, { color: color.icon }]}>{item.Eredmenyek_pont} Ft</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#6C5CE7', '#5A4BD1', '#4A148C']} style={styles.header}>
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.headerContent}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={26} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <MaterialCommunityIcons name="trophy-award" size={22} color="#FFD700" />
            <Text style={styles.headerTitle}> Előző Eredményeim</Text>
          </View>
          <View style={{ width: 36 }} />
        </SafeAreaView>

        {!loading && data.length > 0 && (
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{data.length}</Text>
              <Text style={styles.statLabel}>Játék</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalPont}</Text>
              <Text style={styles.statLabel}>Össznyeremény</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{legjobb}</Text>
              <Text style={styles.statLabel}>Legjobb</Text>
            </View>
          </View>
        )}
      </LinearGradient>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item: WinningItem, index: number) => item.Eredmenyek_id ? item.Eredmenyek_id.toString() : `nyeremeny-${index}`}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="trophy-outline" size={80} color="#E1BEE7" />
              <Text style={styles.emptyTitle}>Még nincs eredményed</Text>
              <Text style={styles.emptyText}>Játssz egy kvízt és itt láthatod az eredményeidet!</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const getStyles = (colors: any, isDark: boolean, width: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Platform.select({
      default: {
        shadowColor: '#6C5CE7',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 12,
      }
    })
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: rf(20, width),
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: rf(16, width),
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: rf(11, width),
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    ...Platform.select({
      web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.08)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 3,
      }
    })
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: rf(15, width),
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: rf(12, width),
    color: colors.text_secondary,
  },
  amountBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    minWidth: 60,
  },
  amountText: {
    fontWeight: 'bold',
    fontSize: rf(16, width),
  },
  amountUnit: {
    fontSize: rf(10, width),
    fontWeight: '600',
    marginTop: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    marginTop: 20,
    fontSize: rf(18, width),
    fontWeight: 'bold',
    color: colors.text,
  },
  emptyText: {
    marginTop: 8,
    fontSize: rf(14, width),
    color: colors.text_secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default OsszesNyeremeny;
