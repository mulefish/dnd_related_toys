
# Board and layout
viewport_width = 1000
viewport_height = 500
hex_size = viewport_width // 50  # size of a hex tile

# Goals and rules
goal_x = viewport_width // 2
goal_y = viewport_height // 2
elf_goal = "reach center and occupy as long as possible"
orc_goal = "kill elves"

# Grid dimensions
rows = viewport_height // hex_size
cols = viewport_width // hex_size

# Identifiers
elf_flag = 'ELF'
orc_flag = 'ORC'
