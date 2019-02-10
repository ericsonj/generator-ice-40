# ######################################################
# Lattice iCE40 
# 
# Makefile
#    make
#    make sim
#    make download
# 
# Created on <%= datetime %>
# ######################################################

MKFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))
CURRENT_DIR := $(notdir $(patsubst %/,%,$(dir $(MKFILE_PATH))))
PROJECT = $(CURRENT_DIR)
TOP_FILE = $(PROJECT).v
MEMORY = "<%= memory %>"
DEPS = $(filter-out $(PROJECT)_tb.v, $(filter-out $(TOP_FILE), $(wildcard *.v)))
BUILD_FOLDER = build
SIM_FOLDER = sim

all: $(BUILD_FOLDER)/$(PROJECT).bin

download: $(BUILD_FOLDER)/$(PROJECT).bin
	iceprog $(BUILD_FOLDER)/$(PROJECT).bin

sim: $(SIM_FOLDER)/$(PROJECT)_tb.vcd gtkware

gtkware:
#-- Ver visualmente la simulacion con gtkwave
	gtkwave $(SIM_FOLDER)/$(PROJECT)_tb.vcd $(SIM_FOLDER)/$(PROJECT)_tb.gtkw &

#-------------------------------
#-- Compilacion y simulacion
#-------------------------------
$(SIM_FOLDER)/$(PROJECT)_tb.vcd: $(TOP_FILE) $(DEPS) $(PROJECT)_tb.v

	@mkdir -p $(SIM_FOLDER)

#-- Compilar
	iverilog $^ -o $(SIM_FOLDER)/$(PROJECT)_tb.out

#-- Simular
	./$(SIM_FOLDER)/$(PROJECT)_tb.out
	mv $(PROJECT)_tb.vcd $(SIM_FOLDER)/

#------------------------------
#-- Sintesis completa
#------------------------------
$(BUILD_FOLDER)/$(PROJECT).bin: $(PROJECT).pcf $(TOP_FILE) $(DEPS) 

	@mkdir -p $(BUILD_FOLDER)

#-- Sintesis
	yosys -p "synth_ice40 -blif $(BUILD_FOLDER)/$(PROJECT).blif" $(TOP_FILE) $(DEPS)

#-- Place & route
	arachne-pnr -d $(MEMORY) -p $(PROJECT).pcf $(BUILD_FOLDER)/$(PROJECT).blif -o $(BUILD_FOLDER)/$(PROJECT).txt

#-- Generar binario final, listo para descargar en fgpa
	icepack $(BUILD_FOLDER)/$(PROJECT).txt $(BUILD_FOLDER)/$(PROJECT).bin

clean:
	rm -rf $(BUILD_FOLDER) $(SIM_FOLDER)
