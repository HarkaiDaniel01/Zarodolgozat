import React, { useState, useEffect, JSX } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Platform, useWindowDimensions, Modal, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Cim from './Cim';
import { useTheme } from './ThemeContext';
import { rf, SPACING, BORDER_RADIUS, FONT_WEIGHTS } from './theme';

interface HibaBejentesekProps {
  onBack: () => void;
}

interface IssueItem {
  hibajelentes_id?: number;
  hiba_szovege: string;
  hibaBejentes_datum?: string;
  status?: string;
  admin_valasz?: string;
}

const formatDate = (raw: string): string => {
  try {
    const d = new Date(raw);
    return d.toLocaleDateString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return raw;
  }
};

const CARD_COLORS = [
  { bg: '#FFEBEE', icon: '#C62828' },
  { bg: '#FCE4EC', icon: '#C2185B' },
  { bg: '#F3E5F5', icon: '#7B1FA2' },
  { bg: '#EDE7F6', icon: '#512DA8' },
  { bg: '#E8EAF6', icon: '#3F51B5' },
];

const HibaBejentesek: React.FC<HibaBejentesekProps> = ({ onBack }) => {
  const { colors, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const styles = getStyles(colors, isDark, width);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [data, setData] = useState<IssueItem[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<IssueItem | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (isPullRefresh = false): Promise<void> => {
    try {
      const userId = await AsyncStorage.getItem('userid');
      if (!userId) return;

      const response = await fetch(`${Cim.Cim}/userhibabejentes/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const json = await response.json();
        setData(json);
      }
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
      if (isPullRefresh) setRefreshing(false);
    }
  };

  const onRefresh = (): void => {
    setRefreshing(true);
    fetchData(true);
  };

  const renderItem = ({ item, index }: { item: IssueItem; index: number }): JSX.Element => {
    let cardStyle = { bg: '#F5F5F5', icon: '#757575' };
    let iconName = 'alert-circle-outline';
    let statusIconName = 'circle-outline';

    switch (item.status) {
      case 'megoldva':
        cardStyle = { bg: '#E8F5E9', icon: '#2E7D32' }; // Zöld
        iconName = 'check-circle-outline';
        statusIconName = 'check-bold'; 
        break;
      case 'új':
        cardStyle = { bg: '#E3F2FD', icon: '#1565C0' }; // Kék
        iconName = 'bell-ring-outline';
        statusIconName = 'alert-circle';
        break;
      case 'vizsgálat alatt':
        cardStyle = { bg: '#FFF3E0', icon: '#EF6C00' }; // Narancs
        iconName = 'clock-time-four-outline';
        statusIconName = 'progress-clock';
        break;
      case 'elutasítva':
        cardStyle = { bg: '#FFEBEE', icon: '#C62828' }; // Piros
        iconName = 'close-circle-outline';
        statusIconName = 'close-thick';
        break;
      default:
        // Ismeretlen státusz esetén ciklikus színek
        cardStyle = CARD_COLORS[index % CARD_COLORS.length];
        iconName = 'alert-circle-outline';
    }

    return (
      <TouchableOpacity 
        style={[styles.card, { borderLeftColor: cardStyle.icon }]}
        onPress={() => setSelectedIssue(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: cardStyle.bg }]}>
          <MaterialCommunityIcons 
             // @ts-ignore
            name={iconName} 
            size={22} 
            color={cardStyle.icon} 
          />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.hiba_szovege}</Text>
          <View style={styles.dateRow}>
            <MaterialCommunityIcons name="calendar-outline" size={12} color={colors.text_secondary} />
            <Text style={styles.cardDate}> {formatDate(item.hibaBejentes_datum || '')}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: cardStyle.bg, width: 40, height: 40 }]}>
           <MaterialCommunityIcons 
             // @ts-ignore
            name={statusIconName} 
            size={20} 
            color={cardStyle.icon} 
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FF6F00', '#E65100', '#BF360C']} style={styles.header}>
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.headerContent}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={26} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <MaterialCommunityIcons name="alert-circle" size={22} color="#FFD700" />
            <Text style={styles.headerTitle}> Hibabejentések</Text>
          </View>
          <TouchableOpacity onPress={onRefresh} style={styles.addButton}>
            <MaterialCommunityIcons name="refresh" size={26} color="#fff" />
          </TouchableOpacity>
        </SafeAreaView>

        {!loading && data.length > 0 && (
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{data.length}</Text>
              <Text style={styles.statLabel}>Összesen</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{data.filter((i) => i.status === 'megoldva').length}</Text>
              <Text style={styles.statLabel}>Megoldva</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{data.filter((i) => i.status !== 'megoldva').length}</Text>
              <Text style={styles.statLabel}>Függőben</Text>
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
          keyExtractor={(item: IssueItem, index: number) => item.hibajelentes_id ? item.hibajelentes_id.toString() : `issue-${index}`}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF6F00']} tintColor="#FF6F00" />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={80} color={colors.primary_light} />
              <Text style={styles.emptyTitle}>Nincsenek hibabejentéseid</Text>
              <Text style={styles.emptyText}>Itt láthatod a korábbi visszajelzéseid státuszát.</Text>
            </View>
          }
        />
      )}

      {selectedIssue && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedIssue(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, {alignItems: 'flex-start'}]}>
            <ScrollView showsVerticalScrollIndicator={false} style={{width: '100%'}} contentContainerStyle={{alignItems: 'flex-start'}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: SPACING.lg}}>
                <Text style={[styles.modalTitle, { marginVertical: 0, textAlign: 'left' }]}>Részletek</Text>
              </View>
              
              <View style={{width: '100%', marginBottom: SPACING.lg}}>
                <Text style={{fontSize: rf(12, width), color: colors.text_secondary, marginBottom: 6, textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 0.5}}>Probléma leírása</Text>
                <Text style={{fontSize: rf(15, width), color: colors.text, lineHeight: 22}}>{selectedIssue.hiba_szovege}</Text>
              </View>
              
              <View style={{width: '100%', marginBottom: SPACING.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{fontSize: rf(12, width), color: colors.text_secondary, textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 0.5}}>Státusz</Text>
                <View style={{
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  backgroundColor: selectedIssue.status === 'megoldva' ? '#E8F5E9' : 
                                   selectedIssue.status === 'elutasítva' ? '#FFEBEE' : '#FFF3E0', 
                  paddingHorizontal: 12, 
                  paddingVertical: 6, 
                  borderRadius: 16
                }}>
                   <MaterialCommunityIcons 
                    name={selectedIssue.status === 'megoldva' ? "check-circle" : 
                          selectedIssue.status === 'elutasítva' ? "close-circle" : "clock-outline"} 
                    size={16} 
                    color={selectedIssue.status === 'megoldva' ? "#2E7D32" : 
                           selectedIssue.status === 'elutasítva' ? "#C62828" : "#EF6C00"} 
                    style={{marginRight: 6}}
                  />
                  <Text style={{
                    color: selectedIssue.status === 'megoldva' ? "#2E7D32" : 
                           selectedIssue.status === 'elutasítva' ? "#C62828" : "#EF6C00", 
                    fontWeight: 'bold',
                    fontSize: rf(13, width)
                  }}>
                    {selectedIssue.status === 'megoldva' ? 'Megoldva' : 
                     selectedIssue.status === 'elutasítva' ? 'Elutasítva' : (selectedIssue.status || 'Függőben')}
                  </Text>
                </View>
              </View>

              <View style={{width: '100%'}}>
                 <Text style={{fontSize: rf(12, width), color: colors.text_secondary, marginBottom: 8, textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 0.5}}>Admin válasza</Text>
                 <View style={{
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F5F5F5', 
                    padding: SPACING.md, 
                    borderRadius: BORDER_RADIUS.md, 
                    borderLeftWidth: 4,
                    borderLeftColor: selectedIssue.admin_valasz ? colors.primary : colors.text_secondary,
                 }}>
                    {selectedIssue.admin_valasz ? (
                      <Text style={{color: colors.text, fontSize: rf(14, width), lineHeight: 20}}>
                        {selectedIssue.admin_valasz}
                      </Text>
                    ) : (
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                         <MaterialCommunityIcons name="message-text-outline" size={18} color={colors.text_secondary} style={{marginRight: 8}} />
                         <Text style={{color: colors.text_secondary, fontStyle: 'italic', fontSize: rf(14, width)}}>
                            Még nem érkezett válasz.
                         </Text>
                      </View>

                      
                    )}
                    
                 </View>
              </View>

              <TouchableOpacity
                    onPress={() => setSelectedIssue(null)}
                    style={{
                      marginTop: SPACING.lg,
                      width: '100%',
                      backgroundColor: colors.error,
                      borderRadius: BORDER_RADIUS.md,
                      padding: SPACING.md,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: rf(15, width) }}>Bezárás</Text>
              </TouchableOpacity>
            </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const getStyles = (colors: any, isDark: boolean, width: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingBottom: SPACING.lg,
      ...Platform.select({
        default: {
          shadowColor: colors.error,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 12,
        },
      }),
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.md,
    },
    backButton: {
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addButton: {
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: rf(20, width),
      fontWeight: FONT_WEIGHTS.bold as 'bold',
      color: '#fff',
      marginLeft: SPACING.xs,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: SPACING.md,
      paddingTop: SPACING.md,
    },
    statBox: {
      flex: 1,
      alignItems: 'center',
    },
    statValue: {
      fontSize: rf(18, width),
      fontWeight: FONT_WEIGHTS.bold as 'bold',
      color: '#fff',
    },
    statLabel: {
      fontSize: rf(11, width),
      color: 'rgba(255,255,255,0.8)',
      marginTop: 2,
    },
    statDivider: {
      width: 1,
      height: 40,
      backgroundColor: 'rgba(255,255,255,0.3)',
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    listContainer: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.lg,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.md,
      marginBottom: SPACING.sm,
      flexDirection: 'row',
      alignItems: 'flex-start',
      borderLeftWidth: 4,
      ...Platform.select({
        web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' },
        default: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.15 : 0.06,
          shadowRadius: 5,
          elevation: 2,
        },
      }),
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SPACING.sm,
      marginTop: 2,
    },
    cardContent: {
      flex: 1,
    },
    cardTitle: {
      fontSize: rf(14, width),
      fontWeight: FONT_WEIGHTS.bold as 'bold',
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
    statusBadge: {
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs,
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 40,
    },
    statusText: {
      fontWeight: FONT_WEIGHTS.bold as 'bold',
      fontSize: rf(16, width),
    },
    emptyContainer: {
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyTitle: {
      fontSize: rf(18, width),
      fontWeight: FONT_WEIGHTS.bold as 'bold',
      color: colors.text,
      marginTop: SPACING.md,
    },
    emptyText: {
      fontSize: rf(14, width),
      color: colors.text_secondary,
      marginTop: SPACING.sm,
      textAlign: 'center',
      maxWidth: 280,
      lineHeight: 20,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '88%',
      maxHeight: '85%',
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      elevation: 10,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: rf(20, width),
      fontWeight: FONT_WEIGHTS.bold as 'bold',
      textAlign: 'center',
      marginVertical: SPACING.sm,
      color: colors.text,
    },
    modalDescription: {
      fontSize: rf(14, width),
      color: colors.text_secondary,
      textAlign: 'center',
      marginBottom: SPACING.md,
    },
    modalInput: {
      backgroundColor: colors.background,
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.md,
      fontSize: rf(14, width),
      color: colors.text,
      width: '100%',
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: SPACING.md,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: SPACING.sm,
      width: '100%',
    },
    modalCancelButton: {
      flex: 1,
      padding: SPACING.md,
      backgroundColor: colors.background,
      borderRadius: BORDER_RADIUS.md,
      alignItems: 'center',
    },
    modalCancelText: {
      fontWeight: FONT_WEIGHTS.bold as 'bold',
      color: colors.text_secondary,
    },
    modalConfirmButton: {
      flex: 1,
      padding: SPACING.md,
      backgroundColor: colors.error,
      borderRadius: BORDER_RADIUS.md,
      alignItems: 'center',
    },
    modalButtonText: {
      fontWeight: FONT_WEIGHTS.bold as 'bold',
      color: colors.text_inverted,
    },
  });

export default HibaBejentesek;
