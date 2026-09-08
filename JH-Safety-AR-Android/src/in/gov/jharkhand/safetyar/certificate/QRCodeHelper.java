package in.gov.jharkhand.safetyar.certificate;

import android.graphics.Bitmap;
import android.graphics.Color;

public class QRCodeHelper {
    public static Bitmap generateQRCode(String data, int size) {
        Bitmap bitmap = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888);
        int modules = 25; // 25x25 grid
        int moduleSize = size / modules;

        // Generate deterministic matrix based on data hash
        boolean[][] matrix = new boolean[modules][modules];
        byte[] bytes = data.getBytes();

        for (int r = 0; r < modules; r++) {
            for (int c = 0; c < modules; c++) {
                // Position Finder Patterns in top-left, top-right, bottom-left corners (7x7)
                if (isFinderPattern(r, c, modules)) {
                    matrix[r][c] = isFinderDark(r, c, modules);
                } else if (r == 6 || c == 6) {
                    // Timing patterns
                    matrix[r][c] = (r + c) % 2 == 0;
                } else {
                    // Data modules with pseudo-random hashing
                    int byteIdx = (r * modules + c) % bytes.length;
                    int bitVal = (bytes[byteIdx] >> ((r + c) % 8)) & 1;
                    matrix[r][c] = (bitVal ^ ((r * 3 + c * 7) % 2)) == 1;
                }
            }
        }

        // Draw onto bitmap
        for (int y = 0; y < size; y++) {
            int r = Math.min(y / moduleSize, modules - 1);
            for (int x = 0; x < size; x++) {
                int c = Math.min(x / moduleSize, modules - 1);
                bitmap.setPixel(x, y, matrix[r][c] ? Color.BLACK : Color.WHITE);
            }
        }
        return bitmap;
    }

    private static boolean isFinderPattern(int r, int c, int size) {
        return (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7);
    }

    private static boolean isFinderDark(int r, int c, int size) {
        int localR = r < 7 ? r : r - (size - 7);
        int localC = c < 7 ? c : c - (size - 7);
        if (localR == 0 || localR == 6 || localC == 0 || localC == 6) return true;
        if (localR >= 2 && localR <= 4 && localC >= 2 && localC <= 4) return true;
        return false;
    }
}
