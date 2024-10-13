#!/usr/bin/env python3
"""
The Base model for all models
"""
from datetime import datetime
import uuid


class BaseModel:
    """
    The base model for all models
    Attributes:
        id (str): The id of the model
        created_at (datetime): The date and time the model was created
        updated_at (datetime): The date and time the model was updated
        __tablename__ (str): The name of the table
    Args:
        id (str): The id of the model
        created_at (datetime): The date and time the model was created
        updated_at (datetime): The date and time the model was updated
    """
    __tablename__ = ""

    def __init__(self, **kwargs):
        if kwargs:
            for key, value in kwargs.items():
                if "created_at" in key or "updated_at" in key:
                    value = datetime.strptime(value, '%Y-%m-%d %H:%M:%S')
                setattr(self, key, value)
        else:
            self.id = str(uuid.uuid4())
            self.created_at = datetime.utcnow()
            self.updated_at = datetime.utcnow()


    def to_dict(self):
        """
        Serialise the instance of the model into a dictionary
        Return:
            A dictionary of the instance
        """

        obj = self.__dict__.copy()

        obj["created_at"] = self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        obj["updated_at"] = self.updated_at.strftime('%Y-%m-%d %H:%M:%S')
        return obj




