import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { BlogContentRenderer } from '../components/BlogContentRenderer';

const sampleHtmlContent = `
<h1>Complete React Native Blog Guide</h1>

<p>This is a comprehensive guide to implementing structured blog content in React Native applications with proper formatting and readability.</p>

<h2>Key Features</h2>

<p>Our blog renderer supports the following HTML elements with beautiful styling:</p>

<h3>Text Formatting</h3>
<ul>
<li><p><strong>Bold text</strong> for emphasis</p></li>
<li><p><em>Italic text</em> for subtle emphasis</p></li>
<li><p><s>Strikethrough text</s> for corrections</p></li>
</ul>

<h3>Lists and Structure</h3>
<ol>
<li><p>Ordered lists with proper numbering</p></li>
<li><p>Unordered lists with bullet points</p></li>
<li><p>Proper spacing and indentation</p></li>
</ol>

<h3>Quotes and Citations</h3>
<blockquote>
<p>This is a blockquote that stands out with special styling and a colored border. Perfect for highlighting important information or quotes from other sources.</p>
</blockquote>

<h2>Technical Implementation</h2>

<p>The implementation uses <code>react-native-render-html</code> library with custom styling to ensure:</p>

<ul>
<li><p>Proper typography hierarchy</p></li>
<li><p>Consistent spacing and margins</p></li>
<li><p>Mobile-optimized readability</p></li>
<li><p>Brand-consistent color scheme</p></li>
</ul>

<h3>Best Practices</h3>

<p>When creating blog content, remember to:</p>

<ol>
<li><p>Use proper heading hierarchy (h1, h2, h3)</p></li>
<li><p>Break content into digestible paragraphs</p></li>
<li><p>Use lists for better scanability</p></li>
<li><p>Include blockquotes for emphasis</p></li>
</ol>

<h2>Conclusion</h2>

<p>With proper HTML rendering, your blog content will have excellent readability and professional appearance on mobile devices. Users can now enjoy properly formatted content with clear structure and hierarchy.</p>
`;

export const BlogContentDemo: React.FC = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Blog Content Renderer Demo</Text>
        <Text style={styles.subtitle}>
          This demonstrates how HTML content is rendered with proper formatting
        </Text>
      </View>
      
      <View style={styles.content}>
        <BlogContentRenderer htmlContent={sampleHtmlContent} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    backgroundColor: '#3DD5DC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E6FFFE',
    lineHeight: 22,
  },
  content: {
    padding: 16,
  },
});

export default BlogContentDemo;