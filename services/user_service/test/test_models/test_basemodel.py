#!/usr/bin/env python3
"""
The test case for the base model
"""
import unittest
from services.user_service.models import BaseModel

class TestBaseModel(unittest.TestCase):
    """
    The test case for the base model
    """

    def setUp(self):
        """
        Sets up the test
        """
        self.basemodel =  BaseModel()

    def test_init(self):
        """
        Tests that the init method works
        """
        self.assertIsInstance(self.basemodel, BaseModel)

    def test_to_dict(self):
        """
        Tests that the serialisation of the model works
        """
        obj = self.basemodel.to_dict()
        self.assertIsInstance(obj, dict)


