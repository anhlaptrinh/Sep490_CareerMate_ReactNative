import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { JdSkill } from '../../data/repository/jdskill/JdSkillRepo';

interface SkillSelectorProps {
  skills: JdSkill[];
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  placeholder?: string;
}

export const SkillSelector: React.FC<SkillSelectorProps> = ({
  skills,
  selectedSkills,
  onSkillsChange,
  placeholder = 'Select skills...',
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSkills, setFilteredSkills] = useState<JdSkill[]>(skills);

  useEffect(() => {
    if (searchQuery) {
      const filtered = skills.filter((skill) =>
        skill.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSkills(filtered);
    } else {
      setFilteredSkills(skills);
    }
  }, [searchQuery, skills]);

  const toggleSkill = (skillName: string) => {
    if (selectedSkills.includes(skillName)) {
      onSkillsChange(selectedSkills.filter((s) => s !== skillName));
    } else {
      onSkillsChange([...selectedSkills, skillName]);
    }
  };

  const removeSkill = (skillName: string) => {
    onSkillsChange(selectedSkills.filter((s) => s !== skillName));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.selector} onPress={() => setModalVisible(true)}>
        <View style={styles.selectorContent}>
          {selectedSkills.length === 0 ? (
            <Text style={styles.placeholder}>{placeholder}</Text>
          ) : (
            <View style={styles.selectedSkillsContainer}>
              {selectedSkills.slice(0, 2).map((skill) => (
                <View key={skill} style={styles.selectedSkillChip}>
                  <Text style={styles.selectedSkillText}>{skill}</Text>
                </View>
              ))}
              {selectedSkills.length > 2 && (
                <Text style={styles.moreText}>+{selectedSkills.length - 2}</Text>
              )}
            </View>
          )}
        </View>
        <Ionicons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      {/* Selected Skills Tags */}
      {selectedSkills.length > 0 && (
        <View style={styles.tagsContainer}>
          {selectedSkills.map((skill) => (
            <View key={skill} style={styles.tag}>
              <Text style={styles.tagText}>{skill}</Text>
              <TouchableOpacity onPress={() => removeSkill(skill)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close-circle" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Skills</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search skills..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#999"
              />
            </View>

            <FlatList
              data={filteredSkills}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                const isSelected = selectedSkills.includes(item.name);
                return (
                  <TouchableOpacity
                    style={[styles.skillItem, isSelected && styles.skillItemSelected]}
                    onPress={() => toggleSkill(item.name)}
                  >
                    <Text style={[styles.skillItemText, isSelected && styles.skillItemTextSelected]}>
                      {item.name}
                    </Text>
                    {isSelected && <Ionicons name="checkmark" size={20} color="#3DD5DC" />}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No skills found</Text>
                </View>
              }
            />

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.doneButtonText}>Done ({selectedSkills.length})</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectorContent: {
    flex: 1,
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
  },
  selectedSkillsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectedSkillChip: {
    backgroundColor: '#E0F7F8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedSkillText: {
    fontSize: 14,
    color: '#3DD5DC',
    fontWeight: '600',
  },
  moreText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E0F7F8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 14,
    color: '#3DD5DC',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 12,
  },
  skillItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  skillItemSelected: {
    backgroundColor: '#F0F9FA',
  },
  skillItemText: {
    fontSize: 16,
    color: '#333',
  },
  skillItemTextSelected: {
    color: '#3DD5DC',
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  doneButton: {
    backgroundColor: '#3DD5DC',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
