import React from 'react';
import { StyleSheet, Dimensions, Text, View } from 'react-native';
import RenderHTML from 'react-native-render-html';

const { width: screenWidth } = Dimensions.get('window');

interface BlogContentRendererProps {
  htmlContent: string;
}

export const BlogContentRenderer: React.FC<BlogContentRendererProps> = ({ htmlContent }) => {
  // Define custom styles for HTML elements
  const tagsStyles = {
    h1: {
      fontSize: 28,
      fontWeight: 'bold' as const,
      color: '#1A1A1A',
      marginBottom: 16,
      marginTop: 24,
      lineHeight: 34,
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold' as const,
      color: '#2C2C2C',
      marginBottom: 14,
      marginTop: 20,
      lineHeight: 30,
    },
    h3: {
      fontSize: 20,
      fontWeight: 'bold' as const,
      color: '#3C3C3C',
      marginBottom: 12,
      marginTop: 16,
      lineHeight: 26,
    },
    h4: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: '#4C4C4C',
      marginBottom: 10,
      marginTop: 14,
      lineHeight: 24,
    },
    p: {
      fontSize: 16,
      lineHeight: 24,
      color: '#333333',
      marginBottom: 12,
      textAlign: 'justify' as const,
    },
    strong: {
      fontWeight: 'bold' as const,
      color: '#1A1A1A',
    },
    em: {
      fontStyle: 'italic' as const,
      color: '#4C4C4C',
    },
    s: {
      textDecorationLine: 'line-through' as const,
      color: '#888888',
    },
    ul: {
      marginBottom: 16,
      marginTop: 8,
      paddingLeft: 20,
    },
    ol: {
      marginBottom: 16,
      marginTop: 8,
      paddingLeft: 20,
    },
    li: {
      fontSize: 16,
      lineHeight: 22,
      color: '#333333',
      marginBottom: 6,
    },
    blockquote: {
      backgroundColor: '#f8f9fa',
      borderLeftWidth: 4,
      borderLeftColor: '#3DD5DC',
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 12,
      paddingBottom: 12,
      marginVertical: 16,
      fontStyle: 'italic' as const,
      borderRadius: 4,
    },
    code: {
      backgroundColor: '#f1f3f4',
      fontFamily: 'monospace',
      fontSize: 14,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 3,
      color: '#d73a49',
    },
    pre: {
      backgroundColor: '#f6f8fa',
      padding: 12,
      borderRadius: 6,
      marginVertical: 12,
      borderWidth: 1,
      borderColor: '#e1e4e8',
    },
    a: {
      color: '#3DD5DC',
      textDecorationLine: 'underline' as const,
    },
  };

  // Define class styles for additional customization
  const classesStyles = {
    'content-container': {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    'highlight': {
      backgroundColor: '#fff3cd',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
  };

  return (
    <View style={styles.container}>
      <RenderHTML
        contentWidth={screenWidth - 32} // Account for padding
        source={{ html: htmlContent }}
        tagsStyles={tagsStyles}
        classesStyles={classesStyles}
        enableExperimentalMarginCollapsing={true}
        defaultTextProps={{
          selectable: true, // Allow text selection
        }}
        systemFonts={['System']} // Use system fonts
        ignoredDomTags={['script', 'iframe']} // Security: ignore potentially dangerous tags
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BlogContentRenderer;