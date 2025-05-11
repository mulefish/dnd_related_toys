import unittest
from .combatants import Elf, Orc, generate_elf_name, generate_orc_name
from .globals import ELF_FLAG, ORC_FLAG

class TestCombatants(unittest.TestCase):

    def test_elf_creation(self):
        elf = Elf(total_points=100)
        self.assertEqual(elf.species, ELF_FLAG)
        self.assertTrue(elf.name)
        self.assertGreaterEqual(elf.range, elf.movement)
        self.assertLessEqual(elf.self_preservation, 100)
        self.assertLessEqual(elf.attack, 100)
        self.assertLessEqual(elf.hitpoints, 100)
        self.assertLessEqual(elf.movement, 100)
        self.assertLessEqual(elf.initiative, 100)

    def test_orc_creation(self):
        orc = Orc(total_points=100)
        self.assertEqual(orc.species, ORC_FLAG)
        self.assertTrue(orc.name)
        self.assertLessEqual(orc.self_preservation, 100)
        self.assertLessEqual(orc.attack, 100)
        self.assertLessEqual(orc.hitpoints, 100)
        self.assertLessEqual(orc.movement, 100)
        self.assertLessEqual(orc.initiative, 100)

    def test_elf_name_generation(self):
        name1 = generate_elf_name()
        name2 = generate_elf_name()
        self.assertTrue(isinstance(name1, str))
        self.assertTrue(len(name1) >= 4)
        self.assertNotEqual(name1, name2)

    def test_orc_name_generation(self):
        name1 = generate_orc_name()
        name2 = generate_orc_name()
        self.assertTrue(isinstance(name1, str))
        self.assertTrue(len(name1) >= 3)
        self.assertNotEqual(name1, name2)

    def test_sight_is_movement_plus_half(self):
        for _ in range(10):
            elf = Elf(100)
            expected_sight = elf.movement + int(elf.movement * 0.5)
            self.assertEqual(elf.sight, expected_sight)


if __name__ == '__main__':
    unittest.main()
    # Dear future: run this thusly: 
    # python -m unittest test_combatants.py

