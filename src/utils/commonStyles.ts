import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from './theme';

export const commonStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        flex: 1,
        padding: SIZES.padding,
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radius,
        padding: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});