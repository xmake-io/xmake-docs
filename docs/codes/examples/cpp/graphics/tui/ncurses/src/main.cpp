#include <ncurses.h>
#include <string>

int main(int argc, char** argv) {
    // Initialize ncurses
    initscr();
    cbreak();
    noecho();
    keypad(stdscr, TRUE);

    // Get screen size
    int height, width;
    getmaxyx(stdscr, height, width);

    // Create a window for our box
    int win_height = 10;
    int win_width = 40;
    int start_y = (height - win_height) / 2;
    int start_x = (width - win_width) / 2;

    WINDOW* win = newwin(win_height, win_width, start_y, start_x);
    refresh();

    // Draw a box around the window
    box(win, 0, 0);

    // Print some text
    std::string text = "Hello from Xmake TUI!";
    mvwprintw(win, win_height / 2, (win_width - text.length()) / 2, text.c_str());
    
    std::string exit_text = "Press any key to exit...";
    mvwprintw(win, win_height / 2 + 2, (win_width - exit_text.length()) / 2, exit_text.c_str());

    // Refresh the window
    wrefresh(win);

    // Wait for input
    getch();

    // Clean up
    delwin(win);
    endwin();

    return 0;
}
