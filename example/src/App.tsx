import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from 'react-native';

import { ModalExample } from './examples/ModalExample';
import { SplitScreenExample } from './examples/SplitScreenExample';

export default function App(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'modal' | 'split'>('split');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'modal' && styles.activeTab]}
          onPress={() => setActiveTab('modal')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'modal' && styles.activeTabText,
            ]}
          >
            Modal View
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'split' && styles.activeTab]}
          onPress={() => setActiveTab('split')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'split' && styles.activeTabText,
            ]}
          >
            Split View
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'modal' ? <ModalExample /> : <SplitScreenExample />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#F7F7F9',
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 15,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#1C1C1E',
  },
  content: {
    flex: 1,
  },
});
