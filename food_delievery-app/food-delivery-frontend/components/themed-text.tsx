import { Text, TextProps } from 'react-native';

type Props = TextProps & {
  type?: 'title' | 'link';
};

export function ThemedText({ type, style, ...props }: Props) {
  return (
    <Text
      {...props}
      style={[
        type === 'title' && { fontSize: 22, fontWeight: 'bold' },
        type === 'link' && { color: '#007AFF' },
        style,
      ]}
    />
  );
}