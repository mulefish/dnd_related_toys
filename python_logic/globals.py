elf_goal = "reach goals be close to them for as long as possible"
orc_goal = "kill elves"

viewport_width = 1000
viewport_height = 500
hex_size = viewport_width // 50  # size of a hex tile

# Grid dimensions
rows = viewport_height // hex_size
cols = viewport_width // hex_size
# TODO: Randomize within rows and cols
goals = [{'row':10, 'col':10},{'row':16, 'col':16},{'row':16, 'col':10},{'row':22, 'col':9}  ]

# flags
elf_flag = 'ELF'
orc_flag = 'ORC'

