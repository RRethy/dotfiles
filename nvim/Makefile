# EXEC = biquadris
# OBJECTS = main.o src/game.o src/board.o src/cell.o src/interpreter.o src/consoleout.o \

# DEPENDS = ${OBJECTS:.o=.d}

${EXEC}: ${OBJECTS}
	${CXX} ${CXXFLAGS} ${OBJECTS} -o ${EXEC} -lX11

-include ${DEPENDS}

# .PHONY: clean

colorscheme: colors/vim-rnb/colors/schemer.erb
	cd colors/vim-rnb/ && erb -T - colors/schemer.erb > ../schemer.vim

# clean:
# 	rm ${OBJECTS} ${EXEC} ${DEPENDS}
