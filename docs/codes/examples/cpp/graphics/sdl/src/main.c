#include <SDL.h>
#include <stdio.h>

int main(int argc, char* args[]) {
    SDL_Window* window = NULL;
    SDL_Surface* screenSurface = NULL;

    if (SDL_Init(SDL_INIT_VIDEO) < 0) {
        printf("SDL could not initialize! SDL_Error: %s\n", SDL_GetError());
    } else {
        window = SDL_CreateWindow("SDL Tutorial", SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED, 640, 480, SDL_WINDOW_SHOWN);
        if (window == NULL) {
            printf("Window could not be created! SDL_Error: %s\n", SDL_GetError());
        } else {
            screenSurface = SDL_GetWindowSurface(window);

            SDL_Event e;
            int quit = 0;
            int x = 0;
            int y = 0;
            int dx = 2;
            int dy = 2;

            while (!quit) {
                while (SDL_PollEvent(&e)) {
                    if (e.type == SDL_QUIT) {
                        quit = 1;
                    }
                }

                // Update position
                x += dx;
                y += dy;

                // Bounce off walls
                if (x < 0 || x > 640 - 50) dx = -dx;
                if (y < 0 || y > 480 - 50) dy = -dy;

                // Fill the surface white
                SDL_FillRect(screenSurface, NULL, SDL_MapRGB(screenSurface->format, 0xFF, 0xFF, 0xFF));

                // Draw a red rectangle
                SDL_Rect rect;
                rect.x = x;
                rect.y = y;
                rect.w = 50;
                rect.h = 50;
                SDL_FillRect(screenSurface, &rect, SDL_MapRGB(screenSurface->format, 0xFF, 0x00, 0x00));

                SDL_UpdateWindowSurface(window);
                SDL_Delay(10);
            }
        }
    }
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}
