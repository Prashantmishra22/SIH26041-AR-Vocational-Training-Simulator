using UnityEngine;

namespace JHSafetyAR.Certificate
{
    public static class QRCodeGenerator
    {
        public static Texture2D GenerateQRCodeTexture(string payload, int width = 256, int height = 256)
        {
            // Creates procedural high-contrast QR pattern texture for runtime display without external DLLs
            Texture2D texture = new Texture2D(width, height, TextureFormat.RGBA32, false);
            Color[] pixels = new Color[width * height];

            int hash = payload.GetHashCode();
            System.Random rnd = new System.Random(hash);

            for (int y = 0; y < height; y++)
            {
                for (int x = 0; x < width; x++)
                {
                    // Border quiet zone
                    if (x < 16 || x > width - 16 || y < 16 || y > height - 16)
                    {
                        pixels[y * width + x] = Color.white;
                        continue;
                    }

                    // 3 Corner Alignment / Finder Patterns
                    bool isTopLeftFinder = (x >= 20 && x <= 70 && y >= height - 70 && y <= height - 20);
                    bool isTopRightFinder = (x >= width - 70 && x <= width - 20 && y >= height - 70 && y <= height - 20);
                    bool isBottomLeftFinder = (x >= 20 && x <= 70 && y >= 20 && y <= 70);

                    if (isTopLeftFinder || isTopRightFinder || isBottomLeftFinder)
                    {
                        pixels[y * width + x] = Color.black;
                    }
                    else
                    {
                        int blockX = x / 8;
                        int blockY = y / 8;
                        bool isBlack = ((blockX * 13 + blockY * 7 + hash) % 3 == 0);
                        pixels[y * width + x] = isBlack ? Color.black : Color.white;
                    }
                }
            }

            texture.SetPixels(pixels);
            texture.Apply();
            return texture;
        }
    }
}
